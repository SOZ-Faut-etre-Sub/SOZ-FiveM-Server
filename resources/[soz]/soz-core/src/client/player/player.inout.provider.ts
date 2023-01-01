import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { Vector3 } from '../../shared/polyzone/vector';
import { PlayerInOutService } from './player.inout.service';

@Provider()
export class PlayerInOutProvider {
    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Tick(500)
    public run(): void {
        const pedCoords = GetEntityCoords(PlayerPedId()) as Vector3;
        this.playerInOutService.get().forEach(elem => {
            const isInside = elem.zone.isPointInside(pedCoords);

            if (isInside !== elem.isLastInside) {
                elem.isLastInside = isInside;
                elem.cb(isInside);
            }
        });
    }
}
