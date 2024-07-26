import { BankAccount } from '@public/shared/bank';

export interface NuiBankMethodMap {
    ShowAccount: undefined;
}

export interface NuiBankSafeMethodMap {
    ShowSafe: BankAccount;
}
