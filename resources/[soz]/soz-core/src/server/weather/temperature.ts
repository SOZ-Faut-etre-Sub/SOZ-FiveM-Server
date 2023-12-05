import { TemperatureRange, Weather } from '../../shared/weather';

// See documentation for the calculated temperature table

export const DaySpringTemperature: TemperatureRange = {
    min: 6,
    max: 26,
};

export const NightSpringTemperature: TemperatureRange = {
    min: 3,
    max: 12,
};

export const DaySummerTemperature: TemperatureRange = {
    min: 15,
    max: 35,
};

export const NightSummerTemperature: TemperatureRange = {
    min: 10,
    max: 22,
};

export const DayAutumnTemperature: TemperatureRange = {
    min: 5,
    max: 20,
};

export const NightAutumnTemperature: TemperatureRange = {
    min: 0,
    max: 12,
};

export const DayWinterTemperature: TemperatureRange = {
    min: 0,
    max: 10,
};

export const NightWinterTemperature: TemperatureRange = {
    min: 0,
    max: 5,
};

export const ForecastAdderTemperatures: Record<Weather, TemperatureRange> = {
    EXTRASUNNY: { min: 4, max: 5 },
    CLEAR: { min: 3, max: 2 },
    NEUTRAL: { min: 0, max: 0 },
    SMOG: { min: -2, max: -2 },
    FOGGY: { min: -1, max: -7 },
    OVERCAST: { min: -3, max: -5 },
    CLOUDS: { min: -3, max: -7 },
    CLEARING: { min: 5, max: -1 },
    RAIN: { min: 3, max: -2 },
    THUNDER: { min: 5, max: -3 },
    SNOW: { min: -5, max: -5 },
    BLIZZARD: { min: -30, max: -30 }, // This is a legit value, not a typo
    SNOWLIGHT: { min: -5, max: 0 },
    XMAS: { min: -5, max: -5 },
    HALLOWEEN: { min: 3, max: 2 },
};
