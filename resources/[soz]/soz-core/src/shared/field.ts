export type FieldOptions = {
    delay: number;
    amount: number;
    lastAction?: number;
};

export type Field = {
    identifier: string;
    owner: string;
    item: string;
    capacity: number;
    maxCapacity: number;
    refill: FieldOptions;
    harvest: FieldOptions;
};
