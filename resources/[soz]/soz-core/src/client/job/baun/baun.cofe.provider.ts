import { TargetFactory } from '../../target/target.factory';
import { JobType } from '@public/shared/job';
import { ServerEvent } from '../../../shared/event';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';

@Provider()
export class BaunCofeProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Once(OnceStep.PlayerLoaded)
    public setupBaunCraftZone() {
        this.targetFactory.createForBoxZone(`baun:bahama:cofe:1`, {
            center: [-1386.60, -605.19, 30.32],
            length: 0.60,
            width: 1.20,
            heading: 211.43,
            minZ: 30.32,
            maxZ: 30.92,
        }, [
            {
                label: 'Faire des cafés',
                icon: 'c:food/cafe.png',
                blackoutGlobal: true,
                job: JobType.Baun,
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                action: () => {
                    this.makeCofe();
                },
            },
        ]);
    }

    async makeCofe() {
        TriggerServerEvent(ServerEvent.BAUN_COFE);
    }
}