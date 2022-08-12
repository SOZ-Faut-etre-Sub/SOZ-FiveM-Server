export const PHONE_NUMBER_REGEX = /^([0-9]{3}-[0-9]{4})|([0-9]{7})$/;
export interface ScriptMessage<T = any> {
    method: string;
    app: string;
    data: T;
}

export enum PhoneEvents {
    OPEN_APP = 'phone:openApp',
    OPEN_PHONE = 'phone:open',
    CLOSE_PHONE = 'phone:close',
    UNLOAD_CHARACTER = 'phone:unloadCharacter',
    SET_AVAILABILITY = 'phone:setAvailability',
    SET_VISIBILITY = 'phone:setVisibility',
    ADD_SNACKBAR_ALERT = 'phone:setSnackarAlert',
    SET_NUMBER = 'phone:setNumber',
    SET_SOCIETY_NUMBER = 'phone:setSocietyNumber',
    SET_PHONE_READY = 'phone:phoneReady',
    SET_CONFIG = 'phone:setPhoneConfig',
    SET_TIME = 'phone:setGameTime',
    SEND_CREDENTIALS = 'phone:sendCredentials',
    FETCH_CREDENTIALS = 'phone:getCredentials',
    TOGGLE_KEYS = 'phone:toggleAllControls',
    SET_PLAYER_LOADED = 'phone:setPlayerLoaded',
}

// Used to standardize the server response
export enum ErrorStringKeys {
    SERVER_ERROR = 'GENERAL_SERVER_ERROR',
    DELETE_FAILED = 'DELETE_FAILED',
    ADD_FAILED = 'ADD_FAILED',
    UPDATE_FAILED = 'UPDATED_FAILED',
    FETCH_FAILED = 'FETCH_FAILED',
}

export interface FxServerRespError {
    errorCode: ErrorStringKeys;
    message: string;
}

export interface FxServerResponse {
    data?: unknown;
    action: string;
    status: 'success' | 'failure';
    app: string;
    error?: FxServerRespError;
}
