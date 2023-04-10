import { On, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { BedLocations } from '../../../shared/job/lsmc';
import { Monitor } from '../../../shared/monitor';
import { PlayerMetadata } from '../../../shared/player';
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
    public revive(source: number, targetid: number, skipanim: boolean, uniteHU: boolean) {
        if (!targetid) {
            targetid = source;
        }

        const player = this.playerService.getPlayer(targetid);
        let uniteHUBed = -1;

        const datas = {} as Partial<PlayerMetadata>;

        if (uniteHU) {
            uniteHUBed = this.getFreeBed(source);
            Player(targetid).state.isWearingPatientOutfit = true;
            datas.inside = player.metadata.inside;
            datas.inside.exitCoord = false;
            datas.inside.apartment = false;
            datas.inside.property = null;
        }

        if (player.metadata.mort) {
            this.notifier.notify(source, player.metadata.mort, 'success', 20000);
        }

        TriggerClientEvent(ClientEvent.LSMC_REVIVE, player.source, skipanim, uniteHU, uniteHUBed);

        datas.hunger = this.playerService.getIncrementedMetadata(player, 'hunger', 30, 0, 100);
        datas.thirst = this.playerService.getIncrementedMetadata(player, 'thirst', 30, 0, 100);
        datas.alcohol = this.playerService.getIncrementedMetadata(player, 'alcohol', -50, 0, 100);
        datas.drug = this.playerService.getIncrementedMetadata(player, 'drug', -50, 0, 100);
        datas.isdead = false;
        datas.mort = '';

        this.playerService.setPlayerMetaDatas(targetid, datas);

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
}
