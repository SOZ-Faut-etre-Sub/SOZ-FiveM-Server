import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { PlayerService } from '../../player/player.service';
import { Qbcore } from '../../qbcore';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class FightForStyleProvider {
    @Inject(Qbcore)
    private qbCore: Qbcore;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }
        this.qbCore.createBlip('jobs:ffs', {
            name: 'Fight For Style',
            coords: { x: 717.72, y: -974.24, z: 24.91 },
            sprite: 808,
            scale: 1.2,
        });
        this.targetFactory.createForBoxZone(
            'ffs:duty',
            {
                center: [707.29, -967.58, 30.41],
                length: 0.35,
                width: 0.4,
                minZ: 30.21,
                maxZ: 30.66,
            },
            [
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Prise de service',
                    canInteract: () => {
                        return !this.playerService.isOnDuty();
                    },
                    job: 'ffs',
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: 'ffs',
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'jobs:ffs:cloakroom',
            {
                center: [709.5, -959.61, 30.4],
                length: 2.0,
                width: 0.55,
                minZ: 29.4,
                maxZ: 32.4,
            },
            [
                {
                    label: 'Se changer',
                    type: 'client',
                    event: 'jobs:client:ffs:OpenCloakroomMenu',
                    icon: 'c:jobs/habiller.png',
                    job: 'ffs',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                },
            ]
        );
    }
}
