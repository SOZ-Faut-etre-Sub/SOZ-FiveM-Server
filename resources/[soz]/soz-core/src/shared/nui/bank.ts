import { BankAccount, BankUiData } from '@public/shared/bank';

export interface NuiBankMethodMap {
    ShowAccount: BankUiData;
}

export interface NuiBankSafeMethodMap {
    ShowSafe: BankAccount;
}
