import { Once, OnceStep, OnGameEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { GameEvent, ServerEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { AnimationService } from '../animation/animation.service';
import { TargetFactory } from '../target/target.factory';
import { PlayerService } from './player.service';

@Provider()
export class PlayerHealthProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Tick(60000)
    private async nutritionLoop(): Promise<void> {
        if (this.playerService.isLoggedIn()) {
            TriggerServerEvent(ServerEvent.PLAYER_NUTRITION_LOOP);
        }
    }

    @Tick(60 * 1000 * 60)
    private async nutritionCheck(): Promise<void> {
        if (this.playerService.isLoggedIn()) {
            TriggerServerEvent(ServerEvent.PLAYER_NUTRITION_CHECK);
        }
    }

    private async doFooting(): Promise<void> {
        // @TODO set player animation and task to do footing
    }

    private async doFreeWeight(): Promise<void> {
        await this.animationService.playAnimation({
            enter: {
                dictionary: 'amb@world_human_push_ups@male@enter',
                name: 'enter',
                duration: 3050,
            },
            base: {
                dictionary: 'amb@world_human_push_ups@male@base',
                name: 'base',
                duration: 4000,
            },
            exit: {
                dictionary: 'amb@world_human_push_ups@male@exit',
                name: 'exit',
                duration: 3400,
            },
        });

        TriggerServerEvent(ServerEvent.PLAYER_INCREASE_STRENGTH);
    }

    @Once()
    async onStart(): Promise<void> {
        this.targetFactory.createForBoxZone(
            'do_free_weight',
            {
                center: { x: -1203.27, y: -1573.62, z: 4.61 },
                length: 1.8,
                minZ: 3.61,
                maxZ: 6.61,
                width: 1,
                heading: 35,
            },
            [
                {
                    label: 'Soulever de la fonte',
                    canInteract: () => {
                        return true;
                    },
                    action: this.doFreeWeight.bind(this),
                },
            ],
            2.5
        );
    }

    @OnGameEvent(GameEvent.CEventNetworkPedDamage)
    async onPedDamage(...args: any[]): Promise<void> {
        // @TODO Stress - check ped is current player
        console.log('CEventNetworkPedDamage', args);
    }

    @OnGameEvent(GameEvent.CEventGunShot)
    async onGunShot(...args: any[]): Promise<void> {
        // @TODO Stress
        console.log('CEventGunShot', args);
    }

    @OnGameEvent(GameEvent.CEventVehicleCollision)
    async onVehicleCollision(...args: any[]): Promise<void> {
        // @TODO Stress - check ped in vehicle (more stress)
        console.log('CEventVehicleCollision', args);
    }

    @OnGameEvent(GameEvent.CEventExplosionHeard)
    async onExplosionHeader(...args: any[]): Promise<void> {
        // @TODO Stress
        console.log('CEventExplosionHeard', args);
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(player: PlayerData): Promise<void> {
        SetPlayerMaxStamina(PlayerId(), player.metadata.maxstamina);

        // @TODO Set damage multiplier
    }

    @Tick(1000)
    async debug(): Promise<void> {
        // console.log(GetPlayerMaxStamina(PlayerId()));
        // console.log(GetPlayerStamina(PlayerId()));
        // console.log('yolo');
    }
}
