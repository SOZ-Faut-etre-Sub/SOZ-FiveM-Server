import { WeatherForecast } from '../../../../../typings/app/weather';

export const MockWeatherForecastsData: WeatherForecast[] = [
    {
        temp: 20,
        icon: 'EXTRASUNNY',
    },
    {
        temp: 45,
        icon: 'SNOW'
    },
    {
        temp: -5,
        icon: 'SNOWLIGHT'
    },
    {
        temp: 22,
        icon: 'THUNDER'
    },
    {
        temp: 0,
        icon: 'NEUTRAL'
    }
]

// export const MockAlertData: Date = new Date(Date.now() + 1000 * 60 * 15);
export const MockAlertData: Date = null;