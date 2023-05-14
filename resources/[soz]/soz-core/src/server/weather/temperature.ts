import { TemperatureRange, Weather } from '../../shared/weather';

export const DaySpringTemperature: TemperatureRange = {
    min: 15,
    max: 35,
};

export const DaySummerTemperature: TemperatureRange = {
    min: 20,
    max: 40,
};

export const DayAutumnTemperature: TemperatureRange = {
    min: 5,
    max: 25,
};

export const DayWinterTemperature: TemperatureRange = {
    min: -5,
    max: 15,
};

export const NightSpringTemperature: TemperatureRange = {
    min: 5,
    max: 25,
};

export const NightSummerTemperature: TemperatureRange = {
    min: 10,
    max: 30,
};

export const NightAutumnTemperature: TemperatureRange = {
    min: -5,
    max: 15,
};

export const NightWinterTemperature: TemperatureRange = {
    min: -20,
    max: 5,
};

export const ForecastMultiplierTemperatures: Record<Weather, TemperatureRange> = {
    EXTRASUNNY: { min: 10, max: 5 },
    CLEAR: { min: 5, max: -2 },
    NEUTRAL: { min: 0, max: 0 },
    SMOG: { min: -2, max: -2 },
    FOGGY: { min: -1, max: -4 },
    OVERCAST: { min: -3, max: -5 },
    CLOUDS: { min: 0, max: -3 },
    CLEARING: { min: 0, max: -2 },
    RAIN: { min: 3, max: -3 },
    THUNDER: { min: 3, max: 2 },
    SNOW: { min: -5, max: -5 },
    BLIZZARD: { min: -10, max: -5 },
    SNOWLIGHT: { min: -5, max: 0 },
    XMAS: { min: -5, max: -5 },
    HALLOWEEN: { min: -5, max: -5 },
    LIGHT_SNOW: { min: -5, max: -3 },
}

export type TemperatureRange = { min: number; max: number };