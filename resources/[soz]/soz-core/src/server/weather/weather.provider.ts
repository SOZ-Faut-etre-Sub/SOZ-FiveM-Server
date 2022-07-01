import { Command } from '../../core/decorators/command';
import { Once } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { Forecast, Time, Weather } from '../../shared/weather';
import { Pollution, PollutionLevel } from '../pollution';
import { Polluted, Summer } from './forecast';

const INCREMENT_SECOND = (3600 * 24) / (60 * 48);

@Provider()
export class WeatherProvider {
    private forecast: Forecast = Summer;

    private shouldUpdateWeather = true;

    @Inject(Pollution)
    private pollution: Pollution;

    @Once()
    onStart(): void {
        GlobalState.blackout ||= false;
        GlobalState.weather ||= 'OVERCAST' as Weather;
        GlobalState.time ||= { hour: 2, minute: 0, second: 0 } as Time;
    }

    @Tick(1000)
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

        GlobalState.time = currentTime;
    }

    private getNextForecast(currentWeather: Weather): Weather {
        let currentForecast = this.forecast;
        const pollutionLevel = this.pollution.getPollutionLevel();

        if (pollutionLevel === PollutionLevel.High) {
            currentForecast = Polluted;
        } else if (pollutionLevel === PollutionLevel.Low) {
            const multipliers: { [key in Weather]?: number } = { EXTRASUNNY: 2, SMOG: 0, FOGGY: 0 };
            const any = 0.75;

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

    @Tick()
    async updateWeather() {
        await wait((Math.random() * 5 + 10) * 60 * 1000);

        if (this.shouldUpdateWeather) {
            GlobalState.weather = this.getNextForecast(GlobalState.weather || 'OVERCAST');
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

        GlobalState.weather = weatherString;
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
        const blackout = status === 'on' || status === 'true';

        GlobalState.blackout = blackout;
    }
}
