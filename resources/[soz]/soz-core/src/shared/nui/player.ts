import { PlayerData } from '../player';

export interface NuiPLayerMethodMap {
    Update: PlayerData;
}

type InvoiceMenuItem = {
    label: string;
    amount: number;
    emitter: string;
};

export type PlayerPersonalMenuData = {
    invoices: InvoiceMenuItem[];
};
