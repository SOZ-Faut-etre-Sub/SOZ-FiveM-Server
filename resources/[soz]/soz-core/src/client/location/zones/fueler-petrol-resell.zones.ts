import { Injectable } from '../../../core/decorators/injectable';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class FuelerPetrolResellZones implements LocationZone {
    get id(): string {
        return 'fueler_petrol_resell';
    }

    get zones(): Record<string, BoxZone> {
        return {
            fueler_petrol_resell: new BoxZone([267.84, -2982.23, 4.93], 40.2, 37.8, {
                heading: 0,
                minZ: 2.93,
                maxZ: 8.93,
            }),
        };
    }
}
