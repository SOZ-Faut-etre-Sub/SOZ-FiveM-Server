import { Command } from '../../core/decorators/command';
import { Once } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PollutionLevel } from '../../shared/pollution';
import { Forecast, Time, Weather } from '../../shared/weather';
import { Pollution } from '../pollution';
import { Halloween, Polluted, SpringAutumn } from './forecast';

const INCREMENT_SECOND = (3600 * 24) / (60 * 48);

@Provider()
export class WeatherProvider {
    private forecast: Forecast = isFeatureEnabled(Feature.Halloween) ? Halloween : SpringAutumn;

    private shouldUpdateWeather = true;

    @Inject(Pollution)
    private pollution: Pollution;

    @Once()
    onStart(): void {
        GlobalState.blackout ||= false;
        GlobalState.blackout_level ||= 0;
        GlobalState.blackout_override = false;
        GlobalState.weather ||= 'OVERCAST' as Weather;
        GlobalState.time ||= { hour: 2, minute: 0, second: 0 } as Time;
    }

    @Tick(TickInterval.EVERY_SECOND)
    advanceTime(): void {
        const currentTime = { ...(GlobalState.time as Time) };

        currentTime.second += INCREMENT_SECOND;

        if (currentTime.second >= 60) {
            const incrementMinutes = Math.floor(currentTime.second / 60);

            currentTime.minute += incrementMinutes;
            currentTime.second %= 60;

            if (currentTime.minute >= 60) {
                const incrementHours = Math.floor(currentTime.minute / 60);

                currentTime.hour += incrementHours;
                currentTime.minute %= 60;

                if (currentTime.hour >= 24) {
                    currentTime.hour %= 24;
                }
            }
        }

        if (isFeatureEnabled(Feature.Halloween)) {
            if (currentTime.hour >= 2 && currentTime.hour < 23) {
                currentTime.hour = 23;
                currentTime.minute = 0;
                currentTime.second = 0;
            }
        }

        GlobalState.time = currentTime;
    }

    @Tick(TickInterval.EVERY_FRAME)
    async updateWeather() {
        await wait((Math.random() * 5 + 10) * 60 * 1000);

        const defaultWeather = isFeatureEnabled(Feature.Halloween) ? 'NEUTRAL' : 'OVERCAST';

        if (this.shouldUpdateWeather) {
            GlobalState.weather = this.getNextForecast(GlobalState.weather || defaultWeather);
        }
    }

    @Exportable('setWeatherUpdate')
    setWeatherUpdate(update: boolean): void {
        this.shouldUpdateWeather = update;
    }

    @Command('weather', { role: 'admin' })
    setWeatherCommand(source: number, weather = ''): void {
        const weatherString = weather.toUpperCase() as Weather;

        if (!this.forecast[weatherString]) {
            console.error('bad weather ' + weatherString);

            return;
        }

        this.setWeather(weatherString);
    }

    public setWeather(weather: Weather): void {
        GlobalState.weather = weather;
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

        GlobalState.time = { hour, minute, second: 0 };
    }

    @Command('blackout', { role: 'admin' })
    setBlackout(source: number, status?: string): void {
        GlobalState.blackout = status === 'on' || status === 'true';
    }

    @Command('blackout_level', { role: 'admin' })
    setBlackoutLevel(source: number, level?: string): void {
        if (!level || level === 'default') {
            GlobalState.blackout_level = 0;
            GlobalState.blackout_override = false;
        } else {
            GlobalState.blackout_level = parseInt(level, 10) || 0;
            GlobalState.blackout_override = true;
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
            console.error('no transitions for, bad weather ' + currentWeather);

            transitions = {};
        }

        if (Object.keys(transitions).length === 0) {
            return 'OVERCAST';
        }

        let totalWeight = 0;

        for (const weight of Object.values(transitions)) {
            totalWeight += weight;
        }

        let random = Math.round(Math.random() * totalWeight);

        for (const [weather, weight] of Object.entries(transitions)) {
            if (random < weight) {
                return weather as Weather;
            }

            random -= weight;
        }

        return 'OVERCAST';
    }
}
