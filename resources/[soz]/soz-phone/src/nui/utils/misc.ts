// Quickly determine whether we are in browser
import { ServerPromiseResp } from '@typings/common';

import { SOZ_PHONE_IS_PRODUCTION } from '../../globals';

export const isEnvBrowser = (): boolean => !SOZ_PHONE_IS_PRODUCTION && !(window as any).invokeNative;

export const getResourceName = () =>
    (window as any).GetParentResourceName ? (window as any)?.GetParentResourceName() : 'soz-phone';

export const buildRespObj = (data: any, status?: 'ok' | 'error', errorMsg?: string): ServerPromiseResp<any> => ({
    data,
    status,
    errorMsg,
});
