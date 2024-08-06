import { Vector2 } from '@public/shared/polyzone/vector';

export type BankMoneyType = 'money' | 'marked_money';
export type BankAccountType = 'player' | 'housestorages' | 'business' | 'safestorages' | 'offshore' | 'bank_atm';
export type BankActionType = 'deposit' | 'withdraw';

export type BankAtmConfig = { maxMoney: number; maxWithdrawal?: number; limit?: number };

export type BankAccount = {
    id: string;
    type: BankAccountType;
    label: string;
    owner: string;
    money: number;
    marked_money: number;
    maxCapacity: number | null;
    config: BankAtmConfig | null;
    coords: Vector2 | null;
};

export type BankContact = {
    id: number;
    label: string;
    accountid: string;
    avatar?: string;
};

export type BankStatement = {
    id: number;
    date: number;
    source_accountid: string;
    target_accountid: string;
    reason: string;
    amount: number;
};

export type AtmUiData = {
    account: BankAccount;
    atm: BankAccount;
    atmAccountId: string;
};

export type BankUiData = {
    accounts: {
        personal: BankAccount;
        enterprise?: BankAccount;
        offshore?: BankAccount;
    };
    contacts: BankContact[];
    history: {
        personal: BankStatement[];
        enterprise?: BankStatement[];
        offshore?: BankStatement[];
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
    kind: string;
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
