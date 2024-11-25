import { DegradationLevel } from '@public/shared/job/pawl';
import { getLocationHash } from '@public/shared/locationhash';
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

export type ItemField = {
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

export type PawlFieldTree = {
    model: string;
    harvestTime: number;
    position: { x: number; y: number; z: number; w: number };
};

export type PawlField = {
    identifier: string;
    field: PawlFieldTree[];
    owner: string;
    radius: number;
    refillDelay: number;
    position: { x: number; y: number; z: number };
};

export type Field = ItemField | PawlField;

export const getAmount = (amount: FieldAmount): number => {
    if (typeof amount === 'number') {
        return amount;
    }

    return Math.floor(Math.random() * (amount.max - amount.min + 1) + amount.min);
};

export const isItemField = (field: Field): field is ItemField => {
    return (field as ItemField).item !== undefined;
};

export const isPawlField = (field: Field): field is PawlField => {
    return (field as PawlField).field !== undefined;
};

export const isTreeCutted = (field: PawlField, tree: PawlFieldTree): boolean => {
    return Date.now() - tree.harvestTime * 1000 <= field.refillDelay;
};

export const getCuttedTrees = (field: PawlField): number => {
    return field.field.filter(tree => isTreeCutted(field, tree)).length;
};

export const PAWL_FIELD_LIST = [
    'paleto_cove',
    'great_chaparral',
    'raton_canyon',
    'alamo_sea',
    'chaparral',
    'grapeseed',
    'baytree_canyon',
];

export const PAWL_FIELD_REFILL_DELAY = 4 * 60 * 60 * 1000;

export const DEGRADATION_THRESHOLD = {
    29: DegradationLevel.Green,
    59: DegradationLevel.Yellow,
    100: DegradationLevel.Red,
};

export const getTreeIdentifier = (field: PawlField, tree: PawlFieldTree): string => {
    return `${field.identifier}_${getLocationHash([tree.position.x, tree.position.y, tree.position.z])}`;
};
