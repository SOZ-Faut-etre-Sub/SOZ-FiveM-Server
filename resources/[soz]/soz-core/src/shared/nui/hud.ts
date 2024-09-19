import { JobType } from '@public/shared/job';
import { News } from '@public/shared/news';
import { AdvancedNotification, BasicNotification, TPoliceNotification } from '@public/shared/notification';
import { VoiceDebugInfo } from '@public/shared/voip';

import { HudCompass, HudDateTime, HudSettings, HudTheme, HudWeaponAmmo, Minimap, VoiceMode } from '../hud';
import { VehicleHud, VehicleHudSpeed } from '../vehicle/vehicle';

export interface NuiHudMethodMap {
    UpdateVehicle: Partial<VehicleHud>;
    UpdateVehicleSpeed: VehicleHudSpeed;
    UpdateMinimap: Minimap;
    UpdateHasWatch: boolean;
    UpdateSettings: HudSettings;
    UpdateHasCompass: boolean;
    UpdateDateTime: HudDateTime;
    UpdateStreetName: string[];
    UpdateCompass: HudCompass;
    UpdateVoiceMode: VoiceMode;
    UpdateVoiceActive: boolean;
    UpdateWeaponAmmo: HudWeaponAmmo;
    SetSyringeDelay: number;
    SetBattery: number;
    SetTwitchNewsOverlay: JobType | null;
    SetShowHud: boolean;
    SetInstructional: string[];
    DrawNotification: Omit<BasicNotification | AdvancedNotification | TPoliceNotification, 'id'> & { id?: string };
    CancelNotification: string;
    AddNews: Omit<News, 'id'>;
    VoipDebug: VoiceDebugInfo | null;
    // Watch Settings
    SetTheme: HudTheme;
    SetZoom: number;
    SetDaltonism: boolean;
    SetShowDateTime: boolean;
    SetShowWeather: boolean;
    SetShowStreetName: boolean;
    SetShowCompass: boolean;
    SetShowStress: boolean;
    SetShowStamina: boolean;
}
