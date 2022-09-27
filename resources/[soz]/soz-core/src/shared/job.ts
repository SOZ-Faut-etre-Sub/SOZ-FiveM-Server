import { ClientEvent } from './event';

export enum JobType {
    Unemployed = 'unemployed',
    Adsl = 'adsl',
    Delivery = 'delivery',
    Religious = 'religious',
    Scrapper = 'scrapper',
    LSPD = 'lspd',
    BCSO = 'bcso',
    LSMC = 'lsmc',
    Taxi = 'taxi',
    Food = 'food',
    News = 'news',
    Garbage = 'garbage',
    Oil = 'oil',
    CashTransfer = 'cash-transfer',
    Bennys = 'bennys',
    Pawl = 'pawl',
    Upw = 'upw',
    Ffs = 'ffs',
}

export type Job = {
    grades: {
        [key: string]: {
            id: number;
            is_default: boolean;
            jobId: string;
            name: string;
            owner: number;
            permissions: {
                [key: string]: {
                    label: string;
                };
            }[];
            salary: number;
            weight: number;
        };
    };
    label: string;
    permissions: {
        [key: string]: {
            label: string;
        };
    }[];
    platePrefix?: string;
    // TODO: Complete when necessary
    temporary?: any;
    bossZones?: any;
    canInvoice?: boolean;
    menuCallback?: ClientEvent;
    resell?: any;
};
