import { WeatherForecast } from '../../../../../typings/app/weather';

export const MockWeatherForecastsData: WeatherForecast[] = [
    {
        temperature: 20,
        weather: 'HALLOWEEN',
        duration: 43200000, // 43200000 for 12 hours
    },
    {
        temperature: 45,
        weather: 'EXTRASUNNY',
        duration: 0,
    },
    {
        temperature: -5,
        weather: 'CLOUDS',
        duration: 0,
    },
    {
        temperature: 22,
        weather: 'SMOG',
        duration: 0,
    },
    {
        temperature: 0,
        weather: 'OVERCAST',
        duration: 0,
    },
    // {
    //     temperature: 0,
    //     weather: 'RAIN',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'THUNDER',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'CLEARING',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'NEUTRAL',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'SNOW',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'BLIZZARD',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'SNOWLIGHT',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'XMAS',
    //     duration: 0,
    // },
    // {
    //     temperature: 0,
    //     weather: 'HALLOWEEN',
    //     duration: 0,
    // },
];

// export const MockAlertData: Date = new Date(Date.now() + 1000 * 60 * 15);
export const MockAlertData: Date = null;
