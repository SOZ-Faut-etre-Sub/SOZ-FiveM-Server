import { Exportable } from '../../../core/decorators/exports';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { JobType } from '../../../shared/job';
import { StonkConfig } from '../../../shared/job/stonk';
import { PlayerService } from '../../player/player.service';

@Provider()
export class StonkCollectProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Exportable('CanBagsBeCollected')
    canBagsBeCollected(brand: string): boolean {
        return (
            this.playerService.getPlayer().job.id === JobType.CashTransfer &&
            this.playerService.isOnDuty() &&
            Object.values(StonkConfig.collection).some(item => item.takeInAvailableIn.includes(brand))
        );
    }
}
