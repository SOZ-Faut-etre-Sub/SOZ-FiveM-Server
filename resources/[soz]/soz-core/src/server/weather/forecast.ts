import { Forecast } from '../../shared/weather';

export const SpringAutumn: Forecast = {
    EXTRASUNNY: { CLEAR: 100 },
    CLEAR: { FOGGY: 10, EXTRASUNNY: 30, OVERCAST: 60 },
    NEUTRAL: {},
    SMOG: { FOGGY: 10, CLEAR: 60, CLOUDS: 30 },
    FOGGY: { SMOG: 20, OVERCAST: 40, CLOUDS: 40 },
    OVERCAST: { CLOUDS: 60, EXTRASUNNY: 20, CLEARING: 20 },
    CLOUDS: { RAIN: 15, FOGGY: 20, OVERCAST: 65 },
    CLEARING: { RAIN: 20, CLOUDS: 55, OVERCAST: 20 },
    RAIN: { THUNDER: 10, SMOG: 30, FOGGY: 30, OVERCAST: 30 },
    THUNDER: { HALLOWEEN: 5, EXTRASUNNY: 45, CLEAR: 50 },
    SNOW: {},
    BLIZZARD: {},
    SNOWLIGHT: {},
    XMAS: {},
    HALLOWEEN: {},
    LIGHT_SNOW: {},
};

export const Winter: Forecast = {
    EXTRASUNNY: { CLEARING: 15, OVERCAST: 15 },
    CLEAR: { CLEARING: 15, OVERCAST: 15, SMOG: 100, FOGGY: 100 },
    NEUTRAL: {},
    SMOG: { CLEARING: 15, OVERCAST: 15 },
    FOGGY: { CLEARING: 15, OVERCAST: 15 },
    OVERCAST: { CLEAR: 85, CLOUDS: 85, EXTRASUNNY: 85, SNOW: 50 },
    CLOUDS: { CLEARING: 15, OVERCAST: 15 },
    CLEARING: { CLEAR: 15, CLOUDS: 15, EXTRASUNNY: 15, THUNDER: 100, RAIN: 100 },
    RAIN: { CLEARING: 5, OVERCAST: 5 },
    THUNDER: {},
    SNOW: { CLEARING: 5, OVERCAST: 5 },
    BLIZZARD: {},
    SNOWLIGHT: { CLEARING: 5, OVERCAST: 5 },
    XMAS: { SNOW: 100 },
    HALLOWEEN: {},
    LIGHT_SNOW: {},
};

export const Summer: Forecast = {
    EXTRASUNNY: { CLOUDS: 10, OVERCAST: 90 },
    CLEAR: {},
    NEUTRAL: {},
    SMOG: {},
    FOGGY: {},
    OVERCAST: { CLOUDS: 5, EXTRASUNNY: 95 },
    CLOUDS: { OVERCAST: 50, EXTRASUNNY: 50 },
    CLEARING: {},
    RAIN: {},
    THUNDER: {},
    SNOW: {},
    BLIZZARD: {},
    SNOWLIGHT: {},
    XMAS: {},
    HALLOWEEN: {},
    LIGHT_SNOW: {},
};

export const Polluted: Forecast = {
    EXTRASUNNY: { SMOG: 80, FOGGY: 20 },
    CLEAR: { SMOG: 80, FOGGY: 20 },
    NEUTRAL: { SMOG: 80, FOGGY: 20 },
    SMOG: { SMOG: 80, FOGGY: 20 },
    FOGGY: { SMOG: 80, FOGGY: 20 },
    OVERCAST: { SMOG: 80, FOGGY: 20 },
    CLOUDS: { SMOG: 80, FOGGY: 20 },
    CLEARING: { SMOG: 80, FOGGY: 20 },
    RAIN: { SMOG: 80, FOGGY: 20 },
    THUNDER: { SMOG: 80, FOGGY: 20 },
    SNOW: { SMOG: 80, FOGGY: 20 },
    BLIZZARD: { SMOG: 80, FOGGY: 20 },
    SNOWLIGHT: { SMOG: 80, FOGGY: 20 },
    XMAS: { SMOG: 80, FOGGY: 20 },
    HALLOWEEN: { SMOG: 80, FOGGY: 20 },
    LIGHT_SNOW: { SMOG: 80, FOGGY: 20 },
};

export const Halloween: Forecast = {
    EXTRASUNNY: {},
    CLEAR: {},
    NEUTRAL: {},
    SMOG: {},
    FOGGY: { FOGGY: 40, CLOUDS: 20, CLEARING: 20, RAIN: 10, THUNDER: 10 },
    OVERCAST: {},
    CLOUDS: { FOGGY: 40, CLOUDS: 20, CLEARING: 20, RAIN: 10, THUNDER: 10 },
    CLEARING: { FOGGY: 40, CLOUDS: 20, CLEARING: 20, RAIN: 10, THUNDER: 10 },
    RAIN: { FOGGY: 40, CLOUDS: 20, CLEARING: 20, RAIN: 10, THUNDER: 10 },
    THUNDER: { FOGGY: 40, CLOUDS: 20, CLEARING: 20, RAIN: 10, THUNDER: 10 },
    SNOW: {},
    BLIZZARD: {},
    SNOWLIGHT: {},
    XMAS: {},
    HALLOWEEN: {},
    LIGHT_SNOW: {},
};
