import { Injectable } from '../../../core/decorators/injectable';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class SouvenirJewelZones implements LocationZone {
    get id(): string {
        return 'souvenir-jewel';
    }

    get zones(): Record<string, BoxZone> {
        return {
            'souvenir-jewel': new BoxZone([-715.15, -248.64, 37.07], 10.0, 10.0, {
                heading: 349.29,
                minZ: 36.07,
                maxZ: 39.07,
            }),
        };
    }
}
