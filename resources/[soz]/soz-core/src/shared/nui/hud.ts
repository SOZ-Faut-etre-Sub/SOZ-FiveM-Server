import { AdvancedNotification, BasicNotification } from '@public/shared/notification';

import { Minimap, VoiceMode } from '../hud';
import { VehicleHud } from '../vehicle/vehicle';

export interface NuiHudMethodMap {
    UpdateVehicle: Partial<VehicleHud>;
    UpdateMinimap: Minimap;
    UpdateVoiceMode: VoiceMode;
    SetShowHud: boolean;
}

export interface NuiHudNotificationMethodMap {
    DrawNotification: Omit<BasicNotification | AdvancedNotification, 'id'>;
}
