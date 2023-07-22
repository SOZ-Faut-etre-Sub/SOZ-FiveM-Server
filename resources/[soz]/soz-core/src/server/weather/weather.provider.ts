import { Context } from '../../core/context';
import { Command } from '../../core/decorators/command';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { Logger } from '../../core/logger';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PollutionLevel } from '../../shared/pollution';
import { getRandomKeyWeighted } from '../../shared/random';
import { Forecast, Time, Weather } from '../../shared/weather';
import { Pollution } from '../pollution';
import { Store } from '../store/store';
import { Polluted, Summer } from './forecast';

const INCREMENT_SECOND = (3600 * 24) / (60 * 48);

@Provider()
export class WeatherProvider {
    @Inject(Pollution)
    private pollution: Pollution;

    @Inject('Store')
    private store: Store;

    @Inject(Logger)
    private logger: Logger;

    private forecast: Forecast = Summer;

    private currentTime: Time = { hour: 2, minute: 0, second: 0 };

    private shouldUpdateWeather = true;

    @Tick(TickInterval.EVERY_SECOND, 'weather:time:advance', true)
    async advanceTime(context: Context) {
        this.currentTime.second += INCREMENT_SECOND;

        if (this.currentTime.second >= 60) {
            const incrementMinutes = Math.floor(this.currentTime.second / 60);

            this.currentTime.minute += incrementMinutes;
            this.currentTime.second %= 60;

            if (this.currentTime.minute >= 60) {
                const incrementHours = Math.floor(this.currentTime.minute / 60);

                this.currentTime.hour += incrementHours;
                this.currentTime.minute %= 60;

                if (this.currentTime.hour >= 24) {
                    this.currentTime.hour %= 24;
                }
            }
        }

        await context.wait(100);

        if (isFeatureEnabled(Feature.Halloween)) {
            if (this.currentTime.hour >= 2 && this.currentTime.hour < 23) {
                this.currentTime.hour = 23;
                this.currentTime.minute = 0;
                this.currentTime.second = 0;
            }
        }

        await context.wait(100);

        TriggerClientEvent(ClientEvent.STATE_UPDATE_TIME, -1, this.currentTime);
    }

    @Tick(TickInterval.EVERY_FRAME, 'weather:next-weather')
    async updateWeather() {
        await wait((Math.random() * 5 + 10) * 60 * 1000);

        if (!this.shouldUpdateWeather) {
            return;
        }

        const defaultWeather = isFeatureEnabled(Feature.Halloween) ? 'NEUTRAL' : 'OVERCAST';
        const currentWeather = this.store.getState().global.weather || defaultWeather;

        this.store.dispatch.global.update({ weather: this.getNextForecast(currentWeather) });
    }

    @Exportable('setWeatherUpdate')
    setWeatherUpdate(update: boolean): void {
        this.shouldUpdateWeather = update;
    }

    @Command('weather', { role: 'admin' })
    setWeatherCommand(source: number, weather = ''): void {
        const weatherString = weather.toUpperCase() as Weather;

        if (!this.forecast[weatherString]) {
            this.logger.error('bad weather ' + weatherString);

            return;
        }

        this.setWeather(weatherString);
    }

    @Command('snow', { role: 'admin' })
    setSnowCommand(source: number, needSnow?: string): void {
        this.store.dispatch.global.update({ snow: needSnow === 'on' || needSnow === 'true' });
    }

    public setWeather(weather: Weather): void {
        this.store.dispatch.global.update({ weather });
    }

    @Command('block_weather', { role: 'admin' })
    blockWeatherCommand(source: number, status?: string): void {
        this.shouldUpdateWeather = status !== 'on' && status !== 'true';
    }

    @Command('time', { role: 'admin' })
    setTime(source: number, hourString?: string, minuteString?: string): void {
        const hour = hourString ? parseInt(hourString, 10) : null;
        const minute = minuteString ? parseInt(minuteString, 10) : 0;

        if (!hour || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return;
        }

        this.currentTime = { hour, minute, second: 0 };
        TriggerClientEvent(ClientEvent.STATE_UPDATE_TIME, -1, this.currentTime);
    }

    @Command('blackout', { role: 'admin' })
    setBlackout(source: number, status?: string): void {
        this.store.dispatch.global.update({ blackout: status === 'on' || status === 'true' });
    }

    @Command('blackout_level', { role: 'admin' })
    setBlackoutLevel(source: number, level?: string): void {
        if (!level || level === 'default') {
            this.store.dispatch.global.update({
                blackoutLevel: 0,
                blackoutOverride: false,
            });
        } else {
            this.store.dispatch.global.update({
                blackoutLevel: parseInt(level, 10) || 0,
                blackoutOverride: true,
            });
        }
    }

    private getNextForecast(currentWeather: Weather): Weather {
        let currentForecast = this.forecast;
        const pollutionLevel = this.pollution.getPollutionLevel();

        if (pollutionLevel === PollutionLevel.High) {
            currentForecast = Polluted;
        } else if (pollutionLevel === PollutionLevel.Low) {
            const multipliers: { [key in Weather]?: number } = { EXTRASUNNY: 1.0, SMOG: 0.5, FOGGY: 0.5, CLOUDS: 0.5 };
            const any = 1;

            for (const weather of Object.keys(currentForecast)) {
                for (const nextWeather of Object.keys(currentForecast[weather])) {
                    const multiplier = multipliers[nextWeather] || any;

                    currentForecast[weather][nextWeather] = Math.round(
                        multiplier * currentForecast[weather][nextWeather]
                    );
                }
            }
        }

        let transitions = currentForecast[currentWeather];

        if (!transitions) {
            this.logger.error('no transitions for, bad weather ' + currentWeather);

            transitions = {};
        }

        return getRandomKeyWeighted<Weather>(transitions, 'OVERCAST') as Weather;
    }
}
