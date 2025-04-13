import { Injectable } from '../../../core/decorators/injectable';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class FuelerPetrolRefineryZones implements LocationZone {
    get id(): string {
        return 'fueler_petrol_refinery';
    }

    get zones(): Record<string, BoxZone> {
        return {
            fueler_petrol_refinery: new BoxZone([2789.93, 1525.87, 24.51], 22.4, 81.6, {
                heading: 75,
                minZ: 23.51,
                maxZ: 26.51,
            }),
        };
    }
}
