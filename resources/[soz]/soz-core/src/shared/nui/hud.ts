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
    UpdateArmorPlates: number;
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
    ForceDisplayInstructional: boolean;
    DrawNotification: Omit<BasicNotification | AdvancedNotification | TPoliceNotification, 'id'> & { id?: string };
    CancelNotification: string;
    AddNews: Omit<News, 'id'>;
    VoipDebug: VoiceDebugInfo | null;
    SetGlassmorphism: boolean;
    SetGlassmorphismFps: number;
    // Watch Settings
    SetTheme: HudTheme;
    SetAvailableTheme: HudTheme[];
    SetZoom: number;
    SetInventorySize: number;
    SetShowDateTime: boolean;
    SetShowWeather: boolean;
    SetShowStreetName: boolean;
    SetShowCompass: boolean;
    SetShowStress: boolean;
    SetShowStamina: boolean;
    SetShowInstructionalOverlay: boolean;
    SetSwitchPlayerStatsPosition: boolean;
}
