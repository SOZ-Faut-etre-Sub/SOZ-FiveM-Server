import { AnimationConfigItem } from '@public/shared/animation';
import { Invoice } from '@public/shared/bank';
import { Job } from '@public/shared/job';

import { PlayerData } from '../player';

export interface NuiPLayerMethodMap {
    Update: PlayerData;
    UpdateAnimationShortcuts: Record<string, Shortcut>;
    UpdateInvoices: Invoice[];
}

export type Shortcut = {
    name: string;
    animation: AnimationConfigItem | null;
};

export type JobMenuData = {
    enabled: boolean;
    job: Job | null;
};

export type PlayerPersonalMenuData = {
    invoices: Invoice[];
    isCinematicMode: boolean;
    isCinematicCameraActive: boolean;
    isHudVisible: boolean;
    shortcuts: Record<string, Shortcut>;
    job: JobMenuData;
};
