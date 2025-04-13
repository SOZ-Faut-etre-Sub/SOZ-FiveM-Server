import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class PacificZones implements LocationZone {
    get id(): string {
        return 'pacific';
    }

    get zones(): Record<string, BoxZone> {
        return {
            pacific1: new BoxZone([250.02, 219.06, 106.28], 35.0, 23.0, { heading: 70, minZ: 100.28, maxZ: 112.28 }),
        };
    }
}
