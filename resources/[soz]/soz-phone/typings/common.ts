export interface ServerPromiseResp<T = undefined> {
    errorMsg?: string;
    status: 'ok' | 'error' | 'silence';
    data?: T;
}
