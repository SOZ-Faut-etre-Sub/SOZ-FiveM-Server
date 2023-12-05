export type FieldOptions = {
    delay: number;
    amount: number;
    lastAction?: number;
};

export type FieldItem = {
    name: string;
    amount: number;
};

export type Field = {
    identifier: string;
    owner: string;
    item: string | FieldItem[];
    capacity: number;
    maxCapacity: number;
    refill: FieldOptions;
    harvest: FieldOptions;
};
