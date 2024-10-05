import { On, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { PlayerUpdate } from '@core/decorators/player';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { emitRpc } from '@core/rpc';
import { wait } from '@core/utils';
import { AnimationService } from '@public/client/animation/animation.service';
import { LSMCDeathProvider } from '@public/client/job/lsmc/lsmc.death.provider';
import { ProgressService } from '@public/client/progress.service';
import { ZoneRepository } from '@public/client/repository/zone.repository';
import { BlurService } from '@public/client/utils/blur.service';
import { AnimationStopReason } from '@public/shared/animation';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { IntervalByStressLooseType, StressLooseType } from '@public/shared/health';
import { Item } from '@public/shared/item';
import { PlayerData } from '@public/shared/player';
import { BoxZone, ZoneType } from '@public/shared/polyzone/box.zone';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { VehicleMidDamageThreshold } from '@public/shared/vehicle/vehicle';

import { FeatureProvider } from '../feature/feature.provider';
import { PlayerService } from './player.service';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';
import { PlayerZombieProvider } from './player.zombie.provider';

@Provider()
export class PlayerStressProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ZoneRepository)
    private zoneRepository: ZoneRepository;

    @Inject(LSMCDeathProvider)
    private LSMCDeathProvider: LSMCDeathProvider;

    @Inject(PlayerZombieProvider)
    private playerZombieProvider: PlayerZombieProvider;

    @Inject(BlurService)
    private blurService: BlurService;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private isStressUpdated = false;
    private wasDead = false;
    private wasHandcuff = false;
    private previousVehicleHealth = null;
    private slowMode = false;
    private invalidMode = false;

    private lastStressTypeUsedAt: Record<StressLooseType, number | null> = {
        [StressLooseType.VehicleAbove160]: null,
        [StressLooseType.VehicleAbove180]: null,
        [StressLooseType.VehicleYellowEngine]: null,
        [StressLooseType.ShootingNearby]: null,
        [StressLooseType.HittingNearby]: null,
        [StressLooseType.SeenDead]: null,
        [StressLooseType.Dead]: null,
        [StressLooseType.Handcuffed]: null,
        [StressLooseType.DrinkCoffee]: null,
        [StressLooseType.DrinkAlcohol]: null,
        [StressLooseType.Smoke]: null,
    };

    private async updateStress(type: StressLooseType, checkZonePosition: Vector3 = null): Promise<void> {
        const lastUsedAt = this.lastStressTypeUsedAt[type];

        const updateTimer = new Date().getTime();
        if (lastUsedAt !== null && updateTimer - lastUsedAt < IntervalByStressLooseType[type] * 60 * 1000) {
            return;
        }

        if (checkZonePosition !== null) {
            for (const zone of this.zoneRepository.get()) {
                if (zone.data.type !== ZoneType.NoStress) {
                    continue;
                }

                const boxZone = BoxZone.fromZone(zone);

                if (boxZone.isPointInside(checkZonePosition)) {
                    return;
                }
            }
        }

        const newTimer = await emitRpc<number>(RpcServerEvent.STRESS_UPDATE, type, updateTimer);
        if (lastUsedAt === null || (newTimer !== null && newTimer > this.lastStressTypeUsedAt[type])) {
            this.lastStressTypeUsedAt[type] = newTimer;
        }
    }

    @OnEvent(ClientEvent.ITEM_USE)
    public onItemUse(name: string, item: Item): void {
        if (!this.featureProvider.isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (name === 'coffee' || name === 'chocolate' || name === 'tea') {
            this.updateStress(StressLooseType.DrinkCoffee);
        }

        if (
            (item.type === 'drink' || item.type === 'cocktail' || item.type === 'liquor') &&
            item.nutrition &&
            item.nutrition.alcohol > 0
        ) {
            this.updateStress(StressLooseType.DrinkAlcohol);
        }

        if (name === 'halloween_radioactive_beer') {
            this.LSMCDeathProvider.enableRadioactiveBeerEffect();
        }
    }

    @On('CEventShockingSeenPedKilled', false)
    public async onCEventShockingSeenPedKilled(entities, eventEntity): Promise<void> {
        await this.onStressfulGameEvent(StressLooseType.SeenDead, entities, eventEntity, 20.0, false);
    }

    @On('CEventShockingGunshotFired', false)
    public async onCEventShockingGunshotFired(entities, eventEntity): Promise<void> {
        const player = PlayerPedId();
        const coords = GetEntityCoords(player);
        const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);

        if ('ARMYB' != zoneID) {
            await this.onStressfulGameEvent(StressLooseType.ShootingNearby, entities, eventEntity, 40.0, false);
        }
    }

    @On('CEventShockingInjuredPed', false)
    public async onCEventShockingInjuredPed(entities, eventEntity): Promise<void> {
        await this.onStressfulGameEvent(StressLooseType.HittingNearby, entities, eventEntity, 20.0, true);
    }

    public async onStressfulGameEvent(
        type: StressLooseType,
        entities,
        eventEntity,
        trigger_distance: number,
        must_be_player = false
    ): Promise<void> {
        if (!this.featureProvider.isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (!eventEntity || !DoesEntityExist(eventEntity)) {
            return;
        }

        if (must_be_player && (!IsEntityAPed(eventEntity) || !IsPedAPlayer(eventEntity))) {
            return;
        }

        const playerPosition = GetEntityCoords(PlayerPedId()) as Vector3;
        const distance = getDistance(GetEntityCoords(eventEntity) as Vector3, playerPosition);

        if (distance > trigger_distance) {
            return;
        }

        await this.updateStress(type, playerPosition);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async checkStressfulEvent(): Promise<void> {
        if (!this.featureProvider.isFeatureEnabled(Feature.MyBodySummer)) {
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
            await this.updateStress(StressLooseType.Dead);
        }

        this.wasDead = player.metadata.isdead;

        if (!this.wasHandcuff && player.metadata.ishandcuffed) {
            await this.updateStress(StressLooseType.Handcuffed);
        }

        this.wasHandcuff = player.metadata.ishandcuffed;

        if (player.metadata.isdead) {
            return;
        }

        const ped = PlayerPedId();
        const currentVehicle = GetVehiclePedIsIn(ped, false);

        if (currentVehicle) {
            const vehicleClass = GetVehicleClass(currentVehicle);
            const engineHealth = GetVehicleEngineHealth(currentVehicle);

            if (this.previousVehicleHealth === null) {
                this.previousVehicleHealth = engineHealth;
            } else if (this.previousVehicleHealth !== engineHealth) {
                if (
                    this.previousVehicleHealth >= VehicleMidDamageThreshold &&
                    engineHealth < VehicleMidDamageThreshold
                ) {
                    await this.updateStress(StressLooseType.VehicleYellowEngine);
                }

                this.previousVehicleHealth = engineHealth;
            }

            if (vehicleClass !== 14 && vehicleClass !== 15 && vehicleClass !== 16) {
                const speed = GetEntitySpeed(currentVehicle) * 3.6;

                if (speed > 160) {
                    await this.updateStress(StressLooseType.VehicleAbove160);
                }

                if (speed > 200) {
                    await this.updateStress(StressLooseType.VehicleAbove180);
                }
            }
        } else {
            this.previousVehicleHealth = null;
        }
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_YOGA)
    async doYoga(): Promise<void> {
        this.animationService
            .playAnimation({
                base: {
                    dictionary: 'timetable@amanda@ig_4',
                    name: 'ig_4_idle',
                    options: {
                        enablePlayerControl: false,
                        repeat: true,
                    },
                },
            })
            .then(cancelled => {
                if (cancelled !== AnimationStopReason.Finished) {
                    this.progressService.cancel();
                }
            });

        const { completed } = await this.progressService.progress('Yoga', 'Vous vous relaxez...', 30000);
        this.animationService.stop();

        if (!completed) {
            return;
        }

        TriggerServerEvent(ServerEvent.PLAYER_DO_YOGA);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onEachFrameStress(): Promise<void> {
        if (this.playerZombieProvider.isZombie()) {
            return;
        }

        if (this.slowMode) {
            DisableControlAction(0, 21, true); // disable sprint
            DisableControlAction(0, 22, true); // disable jump
        }

        if (this.invalidMode) {
            DisableControlAction(0, 24, true); // Attack
            DisableControlAction(0, 25, true); // Aim
            DisableControlAction(2, 36, true); // Disable going stealth
            DisableControlAction(0, 37, true); // Select Weapon
            DisableControlAction(0, 44, true); // Cover
            DisableControlAction(0, 45, true); // Reload
            DisableControlAction(0, 47, true); // Disable weapon
            DisableControlAction(0, 71, true); // disable vehicle accelerate
            DisableControlAction(0, 72, true); // disable vehicle brake
            DisableControlAction(0, 140, true); // Disable melee
            DisableControlAction(0, 141, true); // Disable melee
            DisableControlAction(0, 142, true); // Disable melee
            DisableControlAction(0, 143, true); // Disable melee
            DisableControlAction(0, 257, true); // Attack 2
            DisableControlAction(0, 263, true); // Melee Attack 1
            DisableControlAction(0, 264, true); // Disable melee
        }
    }

    @PlayerUpdate()
    async onPlayerUpdate(player: PlayerData): Promise<void> {
        if (!this.featureProvider.isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        this.slowMode = player.metadata.stress_level > 60;
        await this.playerWalkstyleProvider.updateWalkStyle('stress', this.slowMode ? 'move_m@casual@a' : null);

        this.invalidMode = player.metadata.stress_level > 80;
    }

    @Tick(TickInterval.EVERY_SECOND)
    async playBlurStressEffect(): Promise<void> {
        if (!this.featureProvider.isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (player === null || player.metadata.isdead || player.metadata.godmode) {
            return;
        }

        if (player.metadata.stress_level <= 40) {
            return;
        }

        this.blurService.add('stress', 500);
        await wait(2000);
        this.blurService.remove('stress', 500);

        if (player.metadata.stress_level <= 60) {
            await wait(1000 * 60 * 5);

            return;
        }

        await wait(1000 * 60 * 2);

        return;
    }
}
