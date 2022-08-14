import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { PlayerService } from './player.service';

const EVENT_DISTANCE_TRIGGER = 70.0;

@Provider()
export class PlayerStressProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private isStressUpdated = false;
    private wasDead = false;

    private updateStress(stress = 1): void {
        this.isStressUpdated = true;
        TriggerServerEvent(ServerEvent.PLAYER_INCREASE_STRESS, stress);

        setTimeout(() => {
            this.isStressUpdated = false;
        }, 60000);
    }

    @On('CEventShockingGunshotFired', false)
    @On('CEventGunShot', false)
    @On('CEventOnFire', false)
    @On('CEventRanOverPed', false)
    @On('CEventShocking', false)
    @On('CEventShockingCarCrash', false)
    public onStressfulGameEvent(entities, eventEntity): void {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (this.isStressUpdated) {
            return;
        }

        if (!eventEntity || !DoesEntityExist(eventEntity)) {
            return;
        }

        const distance = getDistance(
            GetEntityCoords(eventEntity) as Vector3,
            GetEntityCoords(PlayerPedId()) as Vector3
        );

        if (distance < EVENT_DISTANCE_TRIGGER) {
            this.updateStress();
        }
    }

    @Tick(1000)
    async checkStressfulEvent(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (this.isStressUpdated) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (player === null || player.metadata.godmode) {
            return;
        }

        if (!this.wasDead && player.metadata.isdead) {
            this.wasDead = true;

            return this.updateStress();
        }

        this.wasDead = player.metadata.isdead;

        if (player.metadata.isdead) {
            return;
        }

        const ped = PlayerPedId();

        if (IsPedShooting(ped)) {
            return this.updateStress();
        }

        if (GetPedAlertness(ped) > 0) {
            return this.updateStress();
        }

        if (IsPedInMeleeCombat(ped)) {
            return this.updateStress();
        }

        const currentVehicle = GetVehiclePedIsIn(ped, false);

        if (currentVehicle) {
            const vehicleClass = GetVehicleClass(currentVehicle);

            if (vehicleClass !== 14 && vehicleClass !== 15 && vehicleClass !== 16) {
                const speed = GetEntitySpeed(currentVehicle) * 2.237;

                if (speed > 130) {
                    return this.updateStress();
                }
            }
        }
    }

    @Tick(1000)
    async onTick(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (player === null || player.metadata.isdead || player.metadata.godmode) {
            return;
        }

        if (player.metadata.stress_level < 20) {
            return;
        } else if (player.metadata.stress_level < 40) {
            ShakeGameplayCam('MEDIUM_EXPLOSION_SHAKE', 0.01);
        } else if (player.metadata.stress_level < 60) {
            ShakeGameplayCam('MEDIUM_EXPLOSION_SHAKE', 0.03);
        } else if (player.metadata.stress_level < 80) {
            ShakeGameplayCam('MEDIUM_EXPLOSION_SHAKE', 0.07);
        } else {
            ShakeGameplayCam('MEDIUM_EXPLOSION_SHAKE', 0.1);
        }
    }
}
