import { Command } from '../../core/decorators/command';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PollutionLevel } from '../../shared/pollution';
import { getRandomInt, getRandomKeyWeighted } from '../../shared/random';
import { Forecast, ForecastWithTemperature, TemperatureRange, Time, Weather } from '../../shared/weather';
import { MonitorService } from '../monitor/monitor.service';
import { Pollution } from '../pollution';
import { Store } from '../store/store';
import { Polluted, SpringAutumn } from './forecast';
import { DaySpringTemperature, ForecastAdderTemperatures, NightSpringTemperature } from './temperature';

const INCREMENT_SECOND = (3600 * 24) / (60 * 48);
const MAX_FORECASTS = 5;

@Provider()
export class WeatherProvider {
    @Inject(Pollution)
    private pollution: Pollution;

    @Inject(MonitorService)
    private monitorService: MonitorService;

    @Inject('Store')
    private store: Store;

    private currentTime: Time = { hour: 2, minute: 0, second: 0 };

    private shouldUpdateWeather = true;

    private defaultWeather: Weather = 'CLEAR';
    private incomingForecasts: ForecastWithTemperature[] = [
        {
            weather: this.defaultWeather,
            temperature: this.getTemperature(this.defaultWeather, GlobalState.time),
            duration: 1000 * 10,
        },
    ];

    // See forecast.ts for the list of available forecasts
    private forecast: Forecast = SpringAutumn;
    // See temperature.ts for the list of available temperature ranges,
    // please ensure that the day and night temperature ranges are using the same season
    private dayTemperatureRange: TemperatureRange = DaySpringTemperature;
    private nightTemperatureRange: TemperatureRange = NightSpringTemperature;

    private stormDeadline = 0; // timestamp

    @Tick(TickInterval.EVERY_SECOND, 'weather:time:advance')
    async advanceTime() {
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

        if (isFeatureEnabled(Feature.Halloween)) {
            if (this.currentTime.hour >= 2 && this.currentTime.hour < 23) {
                this.currentTime.hour = 23;
                this.currentTime.minute = 0;
                this.currentTime.second = 0;
            }
        }

        TriggerClientEvent(ClientEvent.STATE_UPDATE_TIME, -1, this.currentTime);
    }

    @Tick(TickInterval.EVERY_FRAME, 'weather:next-weather')
    async updateWeather() {
        if (!this.shouldUpdateWeather) {
            wait(1000); // No need to update every frame
            return;
        }

        let weather = this.incomingForecasts.shift();
        if (!weather) {
            // This happens when the getTemperature crashes because the PollutionManager is not ready yet.
            // Ideally, you should migrate soz-upw to soz-core and then try to remove this block and see if it works.
            // Just check the logs of the server, if it loops indefinitely, then you need to keep this block.
            weather = {
                weather: this.defaultWeather,
                temperature: this.getTemperature(this.defaultWeather, GlobalState.time),
                duration: 1000 * 10,
            };
        }
        this.store.dispatch.global.update({ weather: weather.weather });
        this.prepareForecasts(weather.weather);

        const defaultWeather = isFeatureEnabled(Feature.Halloween) ? 'NEUTRAL' : 'OVERCAST';
        const currentWeather = this.store.getState().global.weather || defaultWeather;

        this.store.dispatch.global.update({ weather: this.getNextWeather(currentWeather) });
        TriggerClientEvent(ClientEvent.PHONE_APP_WEATHER_UPDATE_FORECASTS, -1);

        await wait(weather.duration || (Math.random() * 5 + 10) * 60 * 1000);
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

    @Command('snow', { role: 'admin' })
    setSnowCommand(source: number, needSnow?: string): void {
        this.store.dispatch.global.update({ snow: needSnow === 'on' || needSnow === 'true' });
    }

    public setStormDeadline(value: number): void {
        this.stormDeadline = value;
        TriggerClientEvent(ClientEvent.PHONE_APP_WEATHER_UPDATE_STORM_ALERT, -1);
    }

    public setWeather(weather: Weather): void {
        // If you set the weather, you want to recalculate the following forecasts
        this.incomingForecasts = [];
        const defaultWeather = isFeatureEnabled(Feature.Halloween) ? 'NEUTRAL' : 'OVERCAST';
        this.store.dispatch.global.update({ weather: weather || defaultWeather });
        this.prepareForecasts(this.store.getState().global.weather);

        TriggerClientEvent(ClientEvent.PHONE_APP_WEATHER_UPDATE_FORECASTS, -1);
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

    @Exportable('getWeatherForecasts')
    getWeatherForecasts(): ForecastWithTemperature[] {
        return this.incomingForecasts;
    }

    @Exportable('getStormAlert')
    getStormAlert(): number {
        return this.stormDeadline;
    }

    private prepareForecasts(initialWeather: Weather) {
        while (this.incomingForecasts.length < MAX_FORECASTS) {
            const futureTime = this.incomingForecasts.reduce((acc, forecast) => {
                const incrementSeconds = forecast.duration / 1000;
                acc.second += incrementSeconds;
                if (acc.second >= 60) {
                    const incrementMinutes = Math.floor(acc.second / 60);

                    acc.minute += incrementMinutes;
                    acc.second %= 60;

                    if (acc.minute >= 60) {
                        const incrementHours = Math.floor(acc.minute / 60);

                        acc.hour += incrementHours;
                        acc.minute %= 60;

                        if (acc.hour >= 24) {
                            acc.hour %= 24;
                        }
                    }
                }
                return acc;
            }, GlobalState.time);

            const randomDuration = (Math.random() * 5 + 10) * 60 * 1000;
            if (this.shouldUpdateWeather) {
                const forecast = this.incomingForecasts.slice(-1);
                const nextWeather = this.getNextWeather(forecast.length ? forecast[0].weather : initialWeather);
                const futureTime = GlobalState.time;

                this.incomingForecasts.push({
                    weather: nextWeather,
                    temperature: this.getTemperature(nextWeather, futureTime),
                    duration: randomDuration,
                });
            } else {
                // As the app will show the next MAX_FORECASTS forecasts,
                // we need to fill the array with the same forecast
                this.incomingForecasts.push({
                    weather: initialWeather,
                    temperature: this.getTemperature(initialWeather, futureTime),
                    duration: randomDuration,
                });
            }
        }
    }

    private getNextWeather(currentWeather: Weather): Weather {
        let currentForecast = this.forecast;
        const pollutionLevel: PollutionLevel = this.pollution.getPollutionLevel();

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

        return getRandomKeyWeighted<Weather>(transitions, 'OVERCAST') as Weather;
    }

    private getTemperature(weather: Weather, time: Time): number {
        const { hour } = time;
        const { min: baseMin, max: baseMax } =
            hour < 6 || hour > 20 ? this.nightTemperatureRange : this.dayTemperatureRange;
        const { min, max } = ForecastAdderTemperatures[weather];

        return getRandomInt(baseMin + min, baseMax + max);
    }
}
