import { On, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { BedLocations } from '../../../shared/job/lsmc';
import { Monitor } from '../../../shared/monitor';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class LSMCDeathProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Notifier)
    private notifier: Notifier;

    private occupiedBeds: Record<number, number> = {};

    @OnEvent(ServerEvent.LSMC_REVIVE)
    public revive(source: number, targetid: number, skipanim: boolean, uniteX: boolean) {
        if (!targetid) {
            targetid = source;
        }

        const player = this.playerService.getPlayer(targetid);
        let uniteXBed = -1;
        if (uniteX) {
            uniteXBed = this.getFreeBed(source);
            Player(targetid).state.isWearingPatientOutfit = true;
        }
        TriggerClientEvent(ClientEvent.LSMC_REVIVE, player.source, skipanim, uniteX, uniteXBed);
        this.playerService.incrementMetadata(targetid, 'hunger', 30, 0, 100);
        this.playerService.incrementMetadata(targetid, 'thirst', 30, 0, 100);
        this.playerService.incrementMetadata(targetid, 'alcohol', -50, 0, 100);
        this.playerService.incrementMetadata(targetid, 'drug', -50, 0, 100);
        this.playerService.setPlayerMetadata(targetid, 'isdead', false);
        this.playerService.setPlayerMetadata(targetid, 'mort', '');
        Player(targetid).state.isdead = false;
    }

    public getFreeBed(source: number): number {
        for (let i = 0; i < BedLocations.length; i++) {
            if (!this.occupiedBeds[i]) {
                this.occupiedBeds[i] = source;
                return i;
            }
        }
        return -1;
    }

    @On('playerDropped')
    @OnEvent(ServerEvent.LSMC_FREE_BED)
    public freeBed(source: number) {
        for (let i = 0; i < BedLocations.length; i++) {
            if (this.occupiedBeds[i] == source) {
                delete this.occupiedBeds[i];
            }
        }
    }

    @OnEvent(ServerEvent.LSMC_ON_DEATH)
    public onDeath(source: number) {
        this.playerService.setPlayerMetadata(source, 'isdead', true);
        Player(source).state.isdead = true;
    }

    @OnEvent(ServerEvent.LSMC_SET_DEATH_REASON)
    public deathReason(source: number, reason: string) {
        const deathDescription = reason ? reason : '';
        this.playerService.setPlayerMetadata(source, 'mort', deathDescription);
        this.monitor.publish('player_dead', { player_source: source }, { reason: deathDescription });
    }

    @OnEvent(ServerEvent.LSMC_NOTIF_DEATH_REASON)
    public notifDeathReason(source: number, target: number) {
        const targetPlayer = this.playerService.getPlayer(target);
        if (targetPlayer.metadata.mort) {
            this.notifier.notify(source, targetPlayer.metadata.mort, 'success', 20000);
        }
    }
}
