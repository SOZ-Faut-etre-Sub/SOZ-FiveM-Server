import { AtmUiData, BankAccount, BankUiData } from '@public/shared/bank';

export interface NuiBankMethodMap {
    ShowAccount: boolean;
    UpdateAccountData: BankUiData;
}

export interface NuiBankAtmMethodMap {
    ShowAtm: AtmUiData;
}

export interface NuiBankSafeMethodMap {
    ShowSafe: BankAccount;
}
