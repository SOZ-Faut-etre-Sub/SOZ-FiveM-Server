import { AtmUiData, BankAccount, BankUiData } from '@public/shared/bank';
import { Vector3 } from '@public/shared/polyzone/vector';

export interface NuiBankMethodMap {
    ShowAccount: boolean;
    UpdateAccountData: BankUiData;
    CloseInterface: void;
}

export interface NuiBankAtmMethodMap {
    ShowAtm: AtmUiData & { atmCoords: Vector3 };
}

export interface NuiBankSafeMethodMap {
    ShowSafe: boolean;
    UpdateAccountData: BankAccount;
}
