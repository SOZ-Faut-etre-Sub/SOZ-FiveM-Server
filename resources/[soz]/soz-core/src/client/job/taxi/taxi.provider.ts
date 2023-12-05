import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { ClientEvent } from '@public/shared/event';

import { BlipFactory } from '../../blip';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
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

    @Once(OnceStep.Start)
    public setupTaxiJob() {
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
