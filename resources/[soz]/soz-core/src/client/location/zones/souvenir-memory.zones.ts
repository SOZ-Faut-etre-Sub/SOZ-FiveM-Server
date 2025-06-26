import { Injectable } from '../../../core/decorators/injectable';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class SouvenirMemoryZones implements LocationZone {
    get id(): string {
        return 'souvenir-memory';
    }

    get zones(): Record<string, BoxZone> {
        return {
            'souvenir-memory': new BoxZone([172.54, 183.4, 105.73], 10.0, 10.0, {
                heading: 336.78,
                minZ: 104.73,
                maxZ: 107.73,
            }),
        };
    }
}
