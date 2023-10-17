import { Forecast } from '../../shared/weather';

export const SpringAutumn: Forecast = {
    EXTRASUNNY: { CLEAR: 100 },
    CLEAR: { FOGGY: 10, EXTRASUNNY: 30, OVERCAST: 60 },
    NEUTRAL: {},
    SMOG: { FOGGY: 10, CLEAR: 60, CLOUDS: 30 },
    FOGGY: { SMOG: 20, OVERCAST: 40, CLOUDS: 40 },
    OVERCAST: { CLOUDS: 60, EXTRASUNNY: 20, CLEARING: 20 },
    CLOUDS: { RAIN: 10, FOGGY: 25, OVERCAST: 65 },
    CLEARING: { RAIN: 15, CLOUDS: 65, OVERCAST: 20 },
    RAIN: { THUNDER: 10, SMOG: 30, FOGGY: 30, OVERCAST: 30 },
    THUNDER: { EXTRASUNNY: 45, CLEAR: 50 },
    SNOW: {},
    BLIZZARD: {},
    SNOWLIGHT: {},
    XMAS: {},
    HALLOWEEN: {},
};

export const Winter: Forecast = {
    EXTRASUNNY: { XMAS: 60 },
    CLEAR: { XMAS: 60, SNOWLIGHT: 5, FOGGY: 5 },
    NEUTRAL: {},
    SMOG: { XMAS: 60 },
    FOGGY: { XMAS: 60, SNOWLIGHT: 5, CLEAR: 5 },
    OVERCAST: { XMAS: 60 },
    CLOUDS: { XMAS: 60 },
    CLEARING: {},
    RAIN: {},
    THUNDER: {},
    SNOW: {},
    BLIZZARD: {},
    SNOWLIGHT: { XMAS: 60, FOGGY: 5, CLEAR: 5 },
    XMAS: { SNOWLIGHT: 60, FOGGY: 5 },
    HALLOWEEN: {},
};

export const Summer: Forecast = {
    EXTRASUNNY: { CLOUDS: 10, OVERCAST: 40, CLEAR: 50 },
    CLEAR: { EXTRASUNNY: 50, CLOUDS: 50 },
    NEUTRAL: {},
    SMOG: {},
    FOGGY: {},
    OVERCAST: { CLOUDS: 15, CLEAR: 80, CLEARING: 5 },
    CLOUDS: { OVERCAST: 10, EXTRASUNNY: 50, CLEAR: 30, CLEARING: 5 },
    CLEARING: { CLOUDS: 50, OVERCAST: 50 },
    RAIN: {},
    THUNDER: {},
    SNOW: {},
    BLIZZARD: {},
    SNOWLIGHT: {},
    XMAS: {},
    HALLOWEEN: {},
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
};
