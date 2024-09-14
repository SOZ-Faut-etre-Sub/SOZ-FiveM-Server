import { ForecastWithTemperature } from '@public/shared/weather';

export interface NuiWeatherMethodMap {
    icon: string;
    forecast: ForecastWithTemperature;
}
