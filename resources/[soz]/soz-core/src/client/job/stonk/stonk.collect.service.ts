import { Inject, Injectable } from '../../../core/decorators/injectable';
import { JobType } from '../../../shared/job';
import { StonkConfig } from '../../../shared/job/stonk';
import { PlayerService } from '../../player/player.service';

@Injectable()
export class StonkCollectService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    canBagsBeCollected(brand: string): boolean {
        return (
            this.playerService.getPlayer().job.id === JobType.CashTransfer &&
            this.playerService.isOnDuty() &&
            Object.values(StonkConfig.collection).some(item => item.takeInAvailableIn.includes(brand))
        );
    }
}
