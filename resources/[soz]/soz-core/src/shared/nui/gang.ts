import { BusinessVehicleMappingUiInput } from '@private/shared/gang';

export interface NuiGangMethodMap {
    ShowGangBusinesses: {
        id: number;
        isboss: boolean;
    };
    ShowGangBusinessVehicleOrder: never;
    ShowGangBusinessCyberApp: never;
    GangBusinessVehicleMapping: BusinessVehicleMappingUiInput;
}
