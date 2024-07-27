import { Vector2 } from '@public/shared/polyzone/vector';

export type BankAccountType = 'player' | 'house_safe' | 'business' | 'safestorages' | 'offshore' | 'bank_atm';

export type BankAccount = {
    id: string;
    type: BankAccountType;
    label: string;
    owner: string;
    money: number;
    marked_money: number;
    maxCapacity: number | null;
    coords: Vector2 | null;
};

export type BankUiData = {
    accounts: {
        personal: BankAccount;
        enterprise: BankAccount;
        offshore: BankAccount;
    };
};

export type BankAtm = {
    accountId: string;
    coords: Vector2;
    hideBlip?: boolean;
};

export enum AtmType {
    PACIFIC = 'pacific',
    FLEECA = 'fleeca',
    BIG = 'big',
    SMALL = 'small',
    ENTERPRISE = 'ent',
}

export type Invoice = {
    id: number;
    citizenid: string;
    emitter: string;
    emitterName: string;
    emitterSafe: string;
    targetAccount: string;
    label: string;
    amount: number;
    payed: boolean;
    refused: boolean;
    createdAt: number;
};

export enum TaxType {
    HOUSING = 'housing',
    VEHICLE = 'vehicle',
    GREEN = 'green',
    FOOD = 'food',
    WEAPON = 'weapon',
    SUPPLY = 'supply',
    TRAVEL = 'travel',
    SERVICE = 'service',
}

export const TaxLabel: Record<TaxType, string> = {
    [TaxType.HOUSING]: "🏠 Taxe d'habitation",
    [TaxType.VEHICLE]: '🚙 Taxe véhicule',
    [TaxType.GREEN]: '🍃 Taxe verte',
    [TaxType.FOOD]: '🍔 Taxe alimentaire',
    [TaxType.WEAPON]: '🔫 Taxe armement',
    [TaxType.SUPPLY]: '👚 Taxe fourniture',
    [TaxType.TRAVEL]: '🛫 Taxe voyage',
    [TaxType.SERVICE]: '🏥 Taxe service',
};

export type Tax = {
    id: TaxType;
    value: number;
};

export const DEFAULT_TAX_PERCENTAGE = 11;
