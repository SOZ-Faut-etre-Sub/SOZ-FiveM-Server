export type ApiConfig = {
    apiEndpoint: string;
    publicEndpoint: string;
};

export enum ApiEvents {
    LOAD_API = 'phone:api:load',
    FETCH_TOKEN = 'phone:api:fetchToken',
}
