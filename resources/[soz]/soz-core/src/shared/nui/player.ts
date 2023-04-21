import { Invoice } from '@public/shared/bank';

import { PlayerData } from '../player';

export interface NuiPLayerMethodMap {
    Update: PlayerData;
}

export type PlayerPersonalMenuData = {
    invoices: Invoice[];
    isCinematicMode: boolean;
    isCinematicCameraActive: boolean;
    isHudVisible: boolean;
};
