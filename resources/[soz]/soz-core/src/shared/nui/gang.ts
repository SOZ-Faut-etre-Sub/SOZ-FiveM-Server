import { BusinessVehicleMappingUiInput, BusinessVehicleOrderUiInput } from '@private/shared/gang';

export interface NuiGangMethodMap {
    ShowGangBusinesses: {
        id: number;
        isboss: boolean;
    };
    ShowGangBusinessVehicleOrder: BusinessVehicleOrderUiInput;
    GangBusinessVehicleMapping: BusinessVehicleMappingUiInput;
}
