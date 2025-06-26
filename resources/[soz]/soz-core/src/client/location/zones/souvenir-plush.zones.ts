import { Injectable } from '../../../core/decorators/injectable';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class SouvenirPlushZones implements LocationZone {
    get id(): string {
        return 'souvenir-plush';
    }

    get zones(): Record<string, BoxZone> {
        return {
            'souvenir-plush': new BoxZone([-315.65, 6193.99, 31.65], 10.0, 10.0, {
                heading: 43.4,
                minZ: 30.65,
                maxZ: 33.65,
            }),
        };
    }
}
