import { News } from '@public/shared/news';
import { AdvancedNotification, BasicNotification } from '@public/shared/notification';

import { Minimap, VoiceMode } from '../hud';
import { VehicleHud, VehicleHudSpeed } from '../vehicle/vehicle';

export interface NuiHudMethodMap {
    UpdateVehicle: Partial<VehicleHud>;
    UpdateVehicleSpeed: VehicleHudSpeed;
    UpdateMinimap: Minimap;
    UpdateVoiceMode: VoiceMode;
    SetShowHud: boolean;
    DrawNotification: Omit<BasicNotification | AdvancedNotification, 'id'>;
    AddNews: Omit<News, 'id'>;
}
