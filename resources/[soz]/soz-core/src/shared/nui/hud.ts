import { JobType } from '@public/shared/job';
import { News } from '@public/shared/news';
import { AdvancedNotification, BasicNotification, TPoliceNotification } from '@public/shared/notification';

import { Minimap, VoiceMode } from '../hud';
import { VehicleHud, VehicleHudSpeed } from '../vehicle/vehicle';

export interface NuiHudMethodMap {
    UpdateVehicle: Partial<VehicleHud>;
    UpdateVehicleSpeed: VehicleHudSpeed;
    UpdateMinimap: Minimap;
    UpdateVoiceMode: VoiceMode;
    SetSyringeDelay: number;
    SetTwitchNewsOverlay: JobType | null;
    SetShowHud: boolean;
    DrawNotification: Omit<BasicNotification | AdvancedNotification | TPoliceNotification, 'id'>;
    AddNews: Omit<News, 'id'>;
}
