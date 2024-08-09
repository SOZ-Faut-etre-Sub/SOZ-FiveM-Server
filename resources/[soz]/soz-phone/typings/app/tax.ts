export type Tax = {
    id: string;
    value: number;
};

export type Nullable<T> = T | null;

export type Taxes = Nullable<{ [key: number]: Tax }>;

export enum TaxEvents {
    FETCH_TAXES = 'phone:app:tax:fetchTaxes',
}
