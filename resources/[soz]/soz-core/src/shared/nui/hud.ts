import { JobType } from '@public/shared/job';
import { News } from '@public/shared/news';
import { AdvancedNotification, BasicNotification, TPoliceNotification } from '@public/shared/notification';
import { VoiceDebugInfo } from '@public/shared/voip';

import { Minimap, VoiceMode } from '../hud';
import { VehicleHud, VehicleHudSpeed } from '../vehicle/vehicle';

export interface NuiHudMethodMap {
    UpdateVehicle: Partial<VehicleHud>;
    UpdateVehicleSpeed: VehicleHudSpeed;
    UpdateMinimap: Minimap;
    UpdateVoiceMode: VoiceMode;
    UpdateVoiceActive: boolean;
    SetSyringeDelay: number;
    SetBattery: number;
    SetTwitchNewsOverlay: JobType | null;
    SetShowHud: boolean;
    DrawNotification: Omit<BasicNotification | AdvancedNotification | TPoliceNotification, 'id'> & { id?: string };
    CancelNotification: string;
    AddNews: Omit<News, 'id'>;
    VoipDebug: VoiceDebugInfo | null;
}
