import { On, Once } from '@public/core/decorators/event';
import { UpwPollution } from '@public/shared/job/upw';
import { getRandomInt, getRandomKeyWeighted } from '@public/shared/random';
import axios from 'axios';
import { addMinutes, addSeconds, differenceInSeconds, format } from 'date-fns';

import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { Logger } from '../../core/logger';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature } from '../../shared/features';
import { RpcServerEvent } from '../../shared/rpc';
import {
    addSecondstoTime,
    DayDurationInMinutes,
    Forecast,
    ForecastWithTemperature,
    IRLDayDurationInMinutes,
    TemperatureRange,
    Time,
    TimeSynchro,
    Weather,
} from '../../shared/weather';
import { FeatureProvider } from '../feature/feature.provider';
import { UpwPollutionProvider } from '../job/upw/upw.pollution.provider';
import { Monitor } from '../monitor/monitor';
import { Store } from '../store/store';
import { Halloween, Polluted, Winter, WMOWeatherMapping } from './forecast';
import { DayWinterTemperature, ForecastAdderTemperatures, NightWinterTemperature } from './temperature';

const MAX_FORECASTS = 6;
const UPDATE_TIME_INTERVAL = 5;

@Provider()
export class WeatherProvider {
    @Inject(UpwPollutionProvider)
    private pollution: UpwPollutionProvider;

    @Inject('Store')
    private store: Store;

    @Inject(Logger)
    private logger: Logger;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private shouldUpdateWeather = true;
    private weatherSyncWithLA = false;

    private timeReady = false;
    private currentTime: Time = { hour: 2, minute: 0, second: 0 };
    // See forecast.ts for the list of available forecasts
    private forecast: Forecast = Winter;
    // See temperature.ts for the list of available temperature ranges,
    // please ensure that the day and night temperature ranges are using the same season
    private dayTemperatureRange: TemperatureRange = DayWinterTemperature;
    private nightTemperatureRange: TemperatureRange = NightWinterTemperature;

    private defaultWeather: Weather = 'OVERCAST';

    private incomingForecasts: ForecastWithTemperature[] = null;

    private stormDeadline = 0; // timestamp
    private timeWeatherDelta = 0;

    @Once()
    public async init() {
        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            this.forecast = Halloween;
            this.defaultWeather = 'CLOUDS';
        }

        if (this.forecast == Winter) {
            this.store.dispatch.global.update({ snow: true });
        }

        try {
            const res = await axios.get('http://worldtimeapi.org/api/timezone/America/Los_Angeles');
            const offset = res.data.utc_offset as string;
            const offsetDate = offset.split(':');
            const localOffset = new Date().getTimezoneOffset() * 60;
            this.timeWeatherDelta = parseInt(offsetDate[0]) * 3600 + parseInt(offsetDate[1]) * 60 + localOffset;
        } catch (e) {
            this.logger.error(e);
        }

        this.syncTime();
    }

    private syncTime() {
        const cur = new Date();
        const IRLTimeSynchro = new Date().setHours(TimeSynchro.IRL, 0, 0, 0);
        const diff = differenceInSeconds(cur, IRLTimeSynchro);

        const IGTimeSynchro = new Date().setHours(TimeSynchro.IG, 0, 0, 0);
        const ig = addSeconds(IGTimeSynchro, (diff * IRLDayDurationInMinutes) / DayDurationInMinutes);
        this.currentTime = {
            hour: ig.getHours(),
            minute: ig.getMinutes(),
            second: ig.getSeconds(),
        };
        this.timeReady = true;
    }

    @Tick(TickInterval.EVERY_SECOND * UPDATE_TIME_INTERVAL, 'weather:time:advance', true)
    async advanceTime() {
        if (!this.timeReady) {
            return;
        }

        addSecondstoTime(this.currentTime, (IRLDayDurationInMinutes / DayDurationInMinutes) * UPDATE_TIME_INTERVAL);

        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            if (this.currentTime.hour >= 2 || this.currentTime.hour < 1) {
                this.currentTime.hour = 1;
                this.currentTime.minute = 0;
                this.currentTime.second = 0;
            }
        }

        TriggerClientEvent(ClientEvent.STATE_UPDATE_TIME, -1, this.currentTime);
    }

    private formatDate(date: Date) {
        return format(date, "yyyy-MM-dd'T'HH:mm:ss");
    }

    @Tick(TickInterval.EVERY_SECOND, 'weather:next-weather')
    async updateWeather() {
        if (!this.shouldUpdateWeather) {
            return;
        }

        if (this.weatherSyncWithLA) {
            const localDate = addSeconds(Date.now(), this.timeWeatherDelta);
            localDate.setHours(this.currentTime.hour);
            localDate.setMinutes(this.currentTime.minute);
            localDate.setSeconds(this.currentTime.second);
            const endDate = addMinutes(localDate, 60 * MAX_FORECASTS);

            const url =
                `https://api.open-meteo.com/v1/forecast?` +
                `latitude=34.05&longitude=-118.24&hourly=weather_code,apparent_temperature&timezone=auto&` +
                `start_hour=${this.formatDate(localDate)}&end_hour=${this.formatDate(endDate)}`;

            try {
                const res = await axios.get(url);

                this.manageForecasts(res.data.hourly);
                const currentForecast = this.incomingForecasts[0];

                this.store.dispatch.global.update({ weather: currentForecast.weather });
                this.monitor.traceEvent('weather_update', {
                    weather: currentForecast.weather,
                    duration: currentForecast.duration,
                    weather_temperature: currentForecast.temperature,
                });

                TriggerClientEvent(ClientEvent.PHONE_APP_WEATHER_UPDATE_FORECASTS, -1);
                TriggerLatentClientEvent(ClientEvent.WEATHER_UPDATE_FORECASTS, -1, 1024, this.getForecasts());

                const duration = currentForecast.duration;
                await wait(duration);
            } catch (e) {
                this.logger.error(url, e);
                await wait(60_000);
            }
        } else {
            if (!this.incomingForecasts) {
                const weather = {
                    weather: this.defaultWeather,
                    duration: 5000,
                    temperature: this.getTemperature(this.defaultWeather, this.currentTime),
                };
                this.incomingForecasts = [weather, weather];
            }

            this.incomingForecasts.shift();
            const weather = this.incomingForecasts[0];
            this.store.dispatch.global.update({ weather: weather.weather });
            this.monitor.traceEvent('weather_update', {
                weather: weather.weather,
                duration: weather.duration,
                weather_temperature: weather.temperature,
            });
            this.prepareForecasts();

            TriggerClientEvent(ClientEvent.PHONE_APP_WEATHER_UPDATE_FORECASTS, -1);
            TriggerLatentClientEvent(ClientEvent.WEATHER_UPDATE_FORECASTS, -1, 1024, this.getForecasts());

            const duration = weather.duration;
            await wait(duration);
        }
    }

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

    public setStormDeadline(value: number): void {
        this.stormDeadline = value;
        TriggerClientEvent(ClientEvent.PHONE_APP_WEATHER_UPDATE_STORM_ALERT, -1);
    }

    public setWeather(weather: Weather): void {
        this.incomingForecasts = [
            {
                weather,
                temperature: this.getTemperature(weather, this.currentTime),
                duration: Math.round((Math.random() * 5 + 10) * 60 * 1000),
            },
        ];
        this.prepareForecasts();
        this.store.dispatch.global.update({ weather: weather });

        TriggerClientEvent(ClientEvent.PHONE_APP_WEATHER_UPDATE_FORECASTS, -1);
        TriggerLatentClientEvent(ClientEvent.WEATHER_UPDATE_FORECASTS, -1, 1024, this.getForecasts());

        this.monitor.traceEvent('weather_update', { weather: weather });
    }

    @Command('block_weather', { role: 'admin' })
    blockWeatherCommand(source: number, status?: string): void {
        this.shouldUpdateWeather = status !== 'on' && status !== 'true';
    }

    @Command('time', { role: 'admin' })
    setTime(source: number, hourString?: string, minuteString?: string): void {
        const hour = hourString ? parseInt(hourString, 10) : null;
        const minute = minuteString ? parseInt(minuteString, 10) : 0;

        if (hour == null) {
            this.syncTime();
        } else {
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
                return;
            }

            this.currentTime = { hour, minute, second: 0 };
        }

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

    @Rpc(RpcServerEvent.GET_FORECASTS)
    public async getForecasts(): Promise<ForecastWithTemperature[]> {
        return this.incomingForecasts;
    }

    @Rpc(RpcServerEvent.GET_STORM_ALERT)
    getStormAlert(): number {
        return this.stormDeadline;
    }

    private manageForecasts(data) {
        this.incomingForecasts = [];
        for (let i = 0; i < data.time.length; i++) {
            if (this.incomingForecasts.length > MAX_FORECASTS) {
                return;
            }

            this.incomingForecasts.push({
                duration: Math.round((Math.random() * 10 + 10) * 60 * 1000),
                temperature: data.apparent_temperature[i],
                weather: WMOWeatherMapping[data.weather_code[i]] || this.defaultWeather,
            });
        }
    }

    @Command('rain', { role: 'admin' })
    setRain(source: number, rain: number): void {
        this.store.dispatch.global.update({ rain: rain });
    }

    @Command('halloween', { role: 'admin' })
    @On(ServerEvent.ADMIN_HALLOWEEN_MOON_UPDATE)
    setTimecycleMod(source: number, value: string): void {
        if (value) {
            if (value == 'full') {
                value = 'HalloweenFullRed';
            } else if (value == 'light') {
                value = 'HalloweenLightRed';
            } else if (value == 'clear') {
                value = 'HalloweenClearRed';
            } else if (value == 'off') {
                value = '';
            } else {
                this.logger.error('Invalid value ' + value + ', expect full or light or clear or off');
            }
        }
        this.store.dispatch.global.update({ halloween: value });
    }

    private prepareForecasts() {
        const initialWeather = this.incomingForecasts[0].weather;

        while (this.incomingForecasts.length < MAX_FORECASTS) {
            const futureTime = this.incomingForecasts.reduce(
                (acc, forecast) => {
                    const incrementSeconds = forecast.duration / 1000;
                    addSecondstoTime(acc, incrementSeconds);
                    return acc;
                },
                { ...this.currentTime }
            );

            const randomDuration = Math.round((Math.random() * 5 + 10) * 60 * 1000);
            if (this.shouldUpdateWeather) {
                const forecast = this.incomingForecasts[this.incomingForecasts.length - 1];
                const nextWeather = this.getNextWeather(forecast.weather);

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
        const pollutionLevel = this.pollution.getPollutionLevel();

        if (pollutionLevel === UpwPollution.High) {
            currentForecast = Polluted;
        } else if (pollutionLevel === UpwPollution.Neutral) {
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
        return getRandomKeyWeighted<Weather>(transitions, currentWeather) as Weather;
    }

    private getTemperature(weather: Weather, time: Time): number {
        const { hour } = time;
        const { min: baseMin, max: baseMax } =
            hour < 6 || hour > 20 ? this.nightTemperatureRange : this.dayTemperatureRange;
        const { min, max } = ForecastAdderTemperatures[weather];

        return getRandomInt(baseMin + min, baseMax + max);
    }
}
