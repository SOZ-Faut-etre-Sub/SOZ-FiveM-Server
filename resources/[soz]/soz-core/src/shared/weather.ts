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
    | 'LIGHT_SNOW'
    | 'XMAS';

export type Time = {
    hour: number;
    minute: number;
    second: number;
};

export type Forecast = Record<Weather, { [key in Weather]?: number }>;

export type ForecastWithTemperature = Forecast & {
    temperature: number;
    duration: number;
}
