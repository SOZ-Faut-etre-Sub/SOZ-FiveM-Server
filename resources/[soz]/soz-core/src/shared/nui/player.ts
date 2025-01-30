import { AnimationConfigItem } from '@public/shared/animation';
import { Invoice } from '@public/shared/bank';
import { InventoryConfiguration, InventoryItem } from '@public/shared/inventory';
import { Job } from '@public/shared/job';
import { Vector3 } from '@public/shared/polyzone/vector';

import { PlayerData } from '../player';

export interface PlayerStats {
    health: number;
    armor: number;
    stamina: number;
    armorPlates: number;
}

export interface NuiPLayerMethodMap {
    Update: PlayerData;
    UpdatePosition: Vector3;
    UpdatePlayerStats: PlayerStats;
    UpdateAnimationShortcuts: Record<string, Shortcut>;
    UpdateCombatMode: boolean;
    UpdateInvoices: Invoice[];
    UpdateInventory: {
        configuration: InventoryConfiguration;
        items: Record<number, InventoryItem>;
    };
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
    isGlassmorphismActive: boolean;
    glassmorphismFpsLimit: number;
    shortcuts: Record<string, Shortcut>;
    combatMode: boolean;
    job: JobMenuData;
    deguisement: boolean;
    naked: boolean;
    arachnophobe: boolean;
};
