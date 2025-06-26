import { Injectable } from '@public/core/decorators/injectable';

import { PolygonZone } from '../../../shared/polyzone/polygon.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class FuelerPetrolFarmZones implements LocationZone {
    get id(): string {
        return 'fueler_petrol_farm';
    }

    get zones(): Record<string, PolygonZone> {
        return {
            fueler_petrol_farm: new PolygonZone(
                [
                    [476.27612304688, 2986.7197265625],
                    [483.51190185546, 2926.3686523438],
                    [509.33477783204, 2909.2048339844],
                    [533.97302246094, 2839.9375],
                    [727.41925048828, 2845.6423339844],
                    [665.96124267578, 3053.6645507812],
                    [588.5396118164, 3042.2253417968],
                ],
                {
                    minZ: 37.55,
                    maxZ: 55.55,
                }
            ),
        };
    }
}
