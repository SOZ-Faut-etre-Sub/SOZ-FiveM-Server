export const DEFAULT_TAX_PERCENTAGE = 11;

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

export type Tax = {
    id: TaxType;
    value: number;
};

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
