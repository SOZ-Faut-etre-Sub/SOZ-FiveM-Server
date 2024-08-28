import { AnimationConfigItem } from '@public/shared/animation';
import { Invoice } from '@public/shared/bank';
import { Job } from '@public/shared/job';
import { Vector3 } from '@public/shared/polyzone/vector';

import { PlayerData } from '../player';

export interface NuiPLayerMethodMap {
    Update: PlayerData;
    UpdatePosition: Vector3;
    UpdatePlayerStats: [number, number];
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
    isCinematicMode: boolean;
    isCinematicCameraActive: boolean;
    isHudVisible: boolean;
    scaledNui: boolean;
    shortcuts: Record<string, Shortcut>;
    job: JobMenuData;
    deguisement: boolean;
    naked: boolean;
    halloween: boolean;
    arachnophobe: boolean;
};
