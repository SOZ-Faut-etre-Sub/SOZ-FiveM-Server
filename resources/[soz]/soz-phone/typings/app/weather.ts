export interface WeatherForecast {
    weather: string;
    temperature: number;
    duration: number;
}

export enum WeatherEvents {
    FETCH_FORECASTS = 'phone:app:weather:fetchForecasts',
    FETCH_STORM_ALERT = 'phone:app:weather:fetchStormAlert',
    UPDATE_FORECASTS = 'phone:app:weather:updateForecasts',
    UPDATE_STORM_ALERT = 'phone:app:weather:updateAlert',
}
