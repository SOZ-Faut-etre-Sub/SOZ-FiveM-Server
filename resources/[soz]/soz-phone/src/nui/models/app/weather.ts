import { createModel } from '@rematch/core';

import { WeatherEvents, WeatherForecast } from '../../../../typings/app/weather';
import { ServerPromiseResp } from '../../../../typings/common';
import { MockAlertData, MockWeatherForecastsData } from '../../apps/weather/utils/constants';
import { fetchNui } from '../../common/utils/fetchNui';
import { buildRespObj } from '../../common/utils/misc';
import { RootModel } from '../index';

export const appWeather = createModel<RootModel>()({
    state: {
        alert: 0,
        forecasts: [] as WeatherForecast[],
    },
    reducers: {
        setForecasts: (state, payload) => {
            return { ...state, forecasts: payload };
        },
        setStormAlert: (state, payload) => {
            return { ...state, alert: payload };
        },
    },
    effects: dispatch => ({
        async updateForecasts(payload: WeatherForecast[]) {
            dispatch.appWeather.setForecasts(payload);
        },
        async updateStormAlert(payload: number) {
            dispatch.appWeather.setStormAlert(payload);
        },
        async refreshForecasts() {
            fetchNui<ServerPromiseResp<WeatherForecast[]>>(
                WeatherEvents.FETCH_FORECASTS,
                undefined,
                buildRespObj(MockWeatherForecastsData)
            )
                .then(response => {
                    dispatch.appWeather.updateForecasts(response.data || null);
                })
                .catch(() => console.error('Failed to load weather forecast'));
        },
        async refreshStormAlert() {
            fetchNui<ServerPromiseResp<number>>(WeatherEvents.FETCH_STORM_ALERT, undefined, buildRespObj(MockAlertData))
                .then(response => {
                    dispatch.appWeather.updateStormAlert(response.data);
                })
                .catch(() => console.error('Failed to load weather alert'));
        },
    }),
});
