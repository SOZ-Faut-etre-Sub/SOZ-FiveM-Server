import { AtmUiData, BankAccount, BankUiData } from '@public/shared/bank';

export interface NuiBankMethodMap {
    ShowAccount: BankUiData;
}

export interface NuiBankAtmMethodMap {
    ShowAtm: AtmUiData;
}

export interface NuiBankSafeMethodMap {
    ShowSafe: BankAccount;
}
