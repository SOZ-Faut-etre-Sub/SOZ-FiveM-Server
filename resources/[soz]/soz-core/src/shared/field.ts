import { Zone } from '@public/shared/polyzone/box.zone';

export type FieldOptions = {
    delay: number;
    amount: FieldAmount;
    lastAction?: number;
};

export type FieldItem = {
    name: string;
    amount: FieldAmount;
};

export type FieldAmount =
    | number
    | {
          min: number;
          max: number;
      };

export enum FieldType {
    Oil = 'oil',
}

export type Field = {
    identifier: string;
    owner: string;
    item: string | FieldItem[];
    capacity: number;
    maxCapacity: number;
    refill: FieldOptions;
    harvest: FieldOptions;
    type?: FieldType;
    zone?: Zone;
};

export const getAmount = (amount: FieldAmount): number => {
    if (typeof amount === 'number') {
        return amount;
    }

    return Math.floor(Math.random() * (amount.max - amount.min + 1) + amount.min);
};
