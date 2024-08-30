import { DBSearch } from '@private/shared/business.cyber';
import {
    BusinessCyberUiInput,
    BusinessSmugglingPrintUiInput,
    BusinessVehicleMappingUiInput,
} from '@private/shared/gang';

export interface NuiGangMethodMap {
    ShowGangBusinesses: {
        id: number;
        isboss: boolean;
    };
    ShowGangBusinessVehicleOrder: never;
    ShowGangBusinessCyberApp: BusinessCyberUiInput;
    ShowGangBusinessSmugglingPrintApp: BusinessSmugglingPrintUiInput;
    GangBusinessVehicleMapping: BusinessVehicleMappingUiInput;
    ShowReport: DBSearch;
}
