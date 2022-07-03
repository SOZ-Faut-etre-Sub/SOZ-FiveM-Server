export interface IBankCredentials {
  name: string;
  account: string;
  balance: number;
}

export interface ITransactions {
  source: number;
  type: string;
  amount: number;
}

export enum BankEvents {
  GET_CREDENTIALS = 'npwd:getBankCredentials',
  SEND_CREDENTIALS = 'npwd:sendBankCredentials',
  FETCH_TRANSACTIONS = 'npwd:fetchAllTransactions',
  TRANSACTION_NOTIFICATION = 'npwd:bankTransactionNotification',
  TRANSACTION_ALERT = 'npwd:bankTransactionAlert',
  SEND_ALERT = 'npwd:sendBankAlert',
  SEND_NOTIFICATION = 'npwd:sendBankNotification',
}
