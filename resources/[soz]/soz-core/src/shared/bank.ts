import { Vector2 } from '@public/shared/polyzone/vector';

export type BankAccount = {
    id: string;
    type: 'player' | 'house_safe' | 'business' | 'safestorages' | 'offshore' | 'bank-atm';
    label: string;
    owner: string;
    money: number;
    markedMoney: number;
    coords: Vector2 | null;
};

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
