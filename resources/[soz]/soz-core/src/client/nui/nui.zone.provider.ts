import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Zone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { NuiMenu } from './nui.menu';

@Provider()
export class NuiZoneProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    public createZoneResolver: (zone: Zone) => void;

    public async askZone(): Promise<Zone> {
        const promise = new Promise<Zone>(resolve => {
            this.createZoneResolver = resolve;
            this.nuiMenu.setMenuVisibility(false);
        });

        promise.finally(() => {
            this.createZoneResolver = null;
            this.nuiMenu.setMenuVisibility(true);
        });

        TriggerEvent('polyzone:pzcreate', 'box', 'create_zone', ['box', 'create_zone', 1, 1]);

        return promise;
    }
    @Command('soz_admin_finish_create_zone', {
        description: "Valider la création d'une zone",
        keys: [
            {
                mapper: 'keyboard',
                key: 'E',
            },
        ],
    })
    public async endCreatingZone() {
        if (this.createZoneResolver) {
            const polyZone = exports['PolyZone'].EndPolyZone();
            const zone = {
                center: [polyZone.center.x, polyZone.center.y, polyZone.center.z] as Vector3,
                length: polyZone.length,
                width: polyZone.width,
                heading: polyZone.heading,
            };

            this.createZoneResolver(zone);
        }
    }
}
