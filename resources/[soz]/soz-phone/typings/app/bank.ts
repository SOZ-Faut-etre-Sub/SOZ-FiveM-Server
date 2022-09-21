export interface IBankCredentials {
    name: string;
    account: string;
    balance: number;
}

export enum BankEvents {
    FIVEM_EVENT_FETCH_BALANCE = 'phone:app:bank:fetchBalance',
    FIVEM_EVENT_UPDATE_BALANCE = 'phone:client:app:bank:updateBalance',
    GET_CREDENTIALS = 'phone:app:bank:getAccountData',
    SEND_CREDENTIALS = 'phone:app:bank:sendAccountData',
}
