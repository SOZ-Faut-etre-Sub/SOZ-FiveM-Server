import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { ClientEvent } from '@public/shared/event';
import { JobPermission, JobType } from '@public/shared/job';

import { BlipFactory } from '../../blip';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';
import { TaxiMissionService } from './mission.taxi.service';

@Provider()
export class TaxiProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(TaxiMissionService)
    private taxiMissionService: TaxiMissionService;

    @Inject(JobService)
    private jobService: JobService;

    @Once(OnceStep.Start)
    public onPlayerLoaded() {
        this.createBlips();

        this.targetFactory.createForBoxZone(
            'duty_taxi',
            {
                center: [903.31, -157.89, 74.17],
                length: 1.0,
                width: 0.4,
                minZ: 73.97,
                maxZ: 74.77,
                heading: 328,
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
                    job: JobType.Taxi,
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: JobType.Taxi,
                },
                {
                    icon: 'fas fa-users',
                    label: 'Employé(e)s en service',
                    action: () => {
                        TriggerServerEvent('QBCore:GetEmployOnDuty');
                    },
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return (
                            this.playerService.isOnDuty() &&
                            this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView)
                        );
                    },
                },
            ]
        );
    }

    private createBlips() {
        this.blipFactory.create('CarlJr Services', {
            name: 'CarlJr Services',
            coords: { x: 903.59, y: -158.47, z: 75.21 },
            sprite: 198,
            scale: 1.1,
        });
    }

    @OnEvent(ClientEvent.JOB_DUTY_CHANGE)
    public async onBlipChabge(duty: boolean) {
        if (!duty) {
            this.taxiMissionService.clearMission();
        }
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH)
    public onDead() {
        this.taxiMissionService.setHorodateurDisplay(false);
    }

    @Tick(2000)
    public checkTaxiMissionService() {
        this.taxiMissionService.update();
    }
}
