import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class LSMCCheckHealthProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    public doBloodCheck(entity: number) {
        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

        TriggerServerEvent(ServerEvent.LSMC_BLOOD_FILL_FLASK, target);
    }

    public doHealthCheck(entity: number) {
        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

        TriggerServerEvent(ServerEvent.LSMC_HEALTH_CHECK, target);
    }

    @Once()
    public onStart() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        this.targetFactory.createForAllPlayer([
            {
                label: 'Prise de sang pour test',
                color: 'lsmc',
                job: 'lsmc',
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                action: this.doBloodCheck.bind(this),
                item: 'flask_blood_empty',
            },
            {
                label: 'Etat de santé',
                color: 'lsmc',
                job: 'lsmc',
                canInteract: () => {
                    // @TODO Add zone check
                    return this.playerService.isOnDuty();
                },
                action: this.doHealthCheck.bind(this),
            },
        ]);

        this.targetFactory.createForBoxZone(
            'lsmc_analyze',
            {
                center: [371.7, -1434.45, 32.51],
                length: 1.8,
                width: 0.8,
                minZ: 31.51,
                maxZ: 34.51,
                heading: 320,
            },
            [
                {
                    label: 'Analyse urinaire',
                    color: 'lsmc',
                    job: 'lsmc',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    event: ServerEvent.LSMC_PEE_ANALYZE,
                    action: () => {
                        TriggerServerEvent(ServerEvent.LSMC_PEE_ANALYZE);
                    },
                    item: 'flask_pee_full',
                },
                {
                    label: 'Analyse de sang',
                    color: 'lsmc',
                    job: 'lsmc',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.LSMC_BLOOD_ANALYZE);
                    },
                    item: 'flask_blood_full',
                },
            ]
        );
    }
}
