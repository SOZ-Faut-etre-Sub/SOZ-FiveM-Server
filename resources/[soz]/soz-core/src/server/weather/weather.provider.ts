import { Command } from '../../core/decorators/command';
import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { Forecast, Time, Weather } from '../../shared/weather';
import { Summer } from './forecast';

const INCREMENT_SECOND = (3600 * 24) / (60 * 48);

@Provider()
export class WeatherProvider {
    private forecast: Forecast = Summer;

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
        const transitions = this.forecast[currentWeather];

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

        GlobalState.weather = this.getNextForecast(GlobalState.weather || ('OVERCAST' as Weather));
    }

    @Command('weather', { role: 'admin' })
    setWeatherCommand(source: number, weather = ''): void {
        const weatherString = weather.toUpperCase() as Weather;

        if (!this.forecast[weatherString]) {
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
