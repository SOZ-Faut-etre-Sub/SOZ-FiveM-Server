import { getWeek } from 'date-fns';

export type Weather =
    | 'BLIZZARD'
    | 'CLEAR'
    | 'CLEARING'
    | 'CLOUDS'
    | 'EXTRASUNNY'
    | 'FOGGY'
    | 'HALLOWEEN'
    | 'NEUTRAL'
    | 'OVERCAST'
    | 'RAIN'
    | 'SMOG'
    | 'SNOW'
    | 'SNOWLIGHT'
    | 'THUNDER'
    | 'XMAS';

export type Time = {
    hour: number;
    minute: number;
    second: number;
};

export function convertTimetoSeconds(time: Time) {
    return time.hour * 3600 + time.minute * 60 + time.second;
}

export function addSecondstoTime(time: Time, value: number) {
    time.second += value;

    if (time.second >= 60) {
        const incrementMinutes = Math.floor(time.second / 60);

        time.minute += incrementMinutes;
        time.second %= 60;

        if (time.minute >= 60) {
            const incrementHours = Math.floor(time.minute / 60);

            time.hour += incrementHours;
            time.minute %= 60;

            if (time.hour >= 24) {
                time.hour %= 24;
            }
        }
    }
}

export const DayDurationInMinutes = 6 * 60;
export const IRLDayDurationInMinutes = 24 * 60;
export const TimeSynchro = {
    IG: 6,
    IRL: 19 + (getWeek(new Date()) % 2 == 1 ? 3 : 0),
};

export type Forecast = Record<Weather, { [key in Weather]?: number }>;

export type TemperatureRange = {
    min: number;
    max: number;
};

export type ForecastWithTemperature = {
    weather: Weather;
    temperature: number;
    duration: number;
};
