import './zones';

import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject, MultiInject } from '../../core/decorators/injectable';
import { ClientEvent } from '../../shared/event/client';
import { PlayerInOutService } from '../player/player.inout.service';
import { LocationZone } from './zones/zones.interface';

@Provider()
export class LocationProvider {
    @Inject(PlayerInOutService)
    private readonly playerInOutService: PlayerInOutService;

    @MultiInject('LocationZone')
    private locations: LocationZone[];

    @Once(OnceStep.Start)
    async onModuleStart() {
        for (const location of this.locations) {
            for (const [zoneId, zone] of Object.entries(location.zones)) {
                this.playerInOutService.add(`location_inout_${location.id}_${zoneId}`, zone, isInside => {
                    TriggerEvent(
                        isInside ? ClientEvent.LOCATION_ENTER : ClientEvent.LOCATION_EXIT,
                        location.id,
                        zoneId
                    );
                });
            }
        }
    }
}
