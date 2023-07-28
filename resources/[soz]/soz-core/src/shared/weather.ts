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
