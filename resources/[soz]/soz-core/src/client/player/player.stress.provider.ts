import { On, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { Item } from '../../shared/item';
import { PlayerData } from '../../shared/player';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { Notifier } from '../notifier';
import { ProgressService } from '../progress.service';
import { PlayerService } from './player.service';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';

enum StressLooseType {
    VehicleAbove160,
    VehicleAbove180,
    VehicleYellowEngine,
    SeenDead,
    ShootingNearby,
    HittingNearby,
    Dead,
    Handcuffed,
    DrinkCoffee,
    DrinkAlcohol,
}

const PointsByStressLooseType: Record<StressLooseType, number> = {
    [StressLooseType.VehicleAbove160]: 1,
    [StressLooseType.VehicleAbove180]: 2,
    [StressLooseType.VehicleYellowEngine]: 3,
    [StressLooseType.ShootingNearby]: 3,
    [StressLooseType.HittingNearby]: 2,
    [StressLooseType.SeenDead]: 2,
    [StressLooseType.Dead]: 10,
    [StressLooseType.Handcuffed]: 1,
    [StressLooseType.DrinkCoffee]: -2,
    [StressLooseType.DrinkAlcohol]: -6,
};

const IntervalByStressLooseType: Record<StressLooseType, number> = {
    [StressLooseType.VehicleAbove160]: 30,
    [StressLooseType.VehicleAbove180]: 30,
    [StressLooseType.VehicleYellowEngine]: 30,
    [StressLooseType.ShootingNearby]: 30,
    [StressLooseType.HittingNearby]: 30,
    [StressLooseType.SeenDead]: 30,
    [StressLooseType.Dead]: 0,
    [StressLooseType.Handcuffed]: 0,
    [StressLooseType.DrinkCoffee]: 30,
    [StressLooseType.DrinkAlcohol]: 30,
};

@Provider()
export class PlayerStressProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

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
    };

    private updateStress(type: StressLooseType): void {
        const lastUsedAt = this.lastStressTypeUsedAt[type];

        if (lastUsedAt !== null && GetGameTimer() - lastUsedAt < IntervalByStressLooseType[type] * 60 * 1000) {
            return;
        }

        const stressPoints = PointsByStressLooseType[type];
        TriggerServerEvent(ServerEvent.PLAYER_INCREASE_STRESS, stressPoints);

        if (stressPoints > 0) {
            this.notifier.notify('Un événement vous a ~r~angoissé~s~.', 'error');
        } else {
            this.notifier.notify('Vous vous sentez moins ~g~angoissé~s~.', 'success');
        }

        this.lastStressTypeUsedAt[type] = GetGameTimer();
    }

    @OnEvent(ClientEvent.ITEM_USE)
    public onItemUse(name: string, item: Item): void {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (name === 'coffee') {
            this.updateStress(StressLooseType.DrinkCoffee);
        }

        if (
            (item.type === 'drink' || item.type === 'cocktail' || item.type === 'liquor') &&
            item.nutrition &&
            item.nutrition.alcohol > 0
        ) {
            this.updateStress(StressLooseType.DrinkAlcohol);
        }
    }

    @On('CEventShockingSeenPedKilled', false)
    public onCEventShockingSeenPedKilled(entities, eventEntity): void {
        this.onStressfulGameEvent(StressLooseType.SeenDead, entities, eventEntity, 20.0, false);
    }

    @On('CEventShockingGunshotFired', false)
    public onCEventShockingGunshotFired(entities, eventEntity): void {
        this.onStressfulGameEvent(StressLooseType.ShootingNearby, entities, eventEntity, 40.0, false);
    }

    @On('CEventShockingInjuredPed', false)
    public onCEventShockingInjuredPed(entities, eventEntity): void {
        this.onStressfulGameEvent(StressLooseType.HittingNearby, entities, eventEntity, 20.0, true);
    }

    public onStressfulGameEvent(
        type: StressLooseType,
        entities,
        eventEntity,
        trigger_distance: number,
        must_be_player = false
    ): void {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (!eventEntity || !DoesEntityExist(eventEntity)) {
            return;
        }

        if (must_be_player && (!IsEntityAPed(eventEntity) || !IsPedAPlayer(eventEntity))) {
            return;
        }

        const distance = getDistance(
            GetEntityCoords(eventEntity) as Vector3,
            GetEntityCoords(PlayerPedId()) as Vector3
        );

        if (distance > trigger_distance) {
            return;
        }

        this.updateStress(type);
    }

    @Tick(TickInterval.EVERY_SECOND)
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
            this.updateStress(StressLooseType.Dead);
        }

        this.wasDead = player.metadata.isdead;

        if (!this.wasHandcuff && player.metadata.ishandcuffed) {
            this.updateStress(StressLooseType.Handcuffed);
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
                if (this.previousVehicleHealth >= 800 && engineHealth < 800) {
                    this.updateStress(StressLooseType.VehicleYellowEngine);
                }

                this.previousVehicleHealth = engineHealth;
            }

            if (vehicleClass !== 14 && vehicleClass !== 15 && vehicleClass !== 16) {
                const speed = GetEntitySpeed(currentVehicle) * 3.6;

                if (speed > 160) {
                    this.updateStress(StressLooseType.VehicleAbove160);
                }

                if (speed > 200) {
                    this.updateStress(StressLooseType.VehicleAbove180);
                }
            }
        } else {
            this.previousVehicleHealth = null;
        }
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_YOGA)
    async doYoga(): Promise<void> {
        const { completed } = await this.progressService.progress('Yoga', 'Vous vous relaxez...', 30000, {
            dictionary: 'timetable@amanda@ig_4',
            name: 'ig_4_idle',
        });

        if (!completed) {
            return;
        }

        TriggerServerEvent(ServerEvent.PLAYER_DO_YOGA);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onEachFrame(): Promise<void> {
        if (this.slowMode) {
            await this.playerWalkstyleProvider.applyWalkStyle('move_m@casual@a');
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

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(player: PlayerData): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        this.slowMode = player.metadata.stress_level > 60;
        this.invalidMode = player.metadata.stress_level > 80;
    }

    @Tick(TickInterval.EVERY_SECOND)
    async playBlurStressEffect(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (player === null || player.metadata.isdead || player.metadata.godmode) {
            return;
        }

        if (player.metadata.stress_level <= 40) {
            return;
        }

        const blurAction = async () => {
            TriggerScreenblurFadeIn(500);
            await wait(2000);
            TriggerScreenblurFadeOut(500);
        };

        blurAction();

        if (player.metadata.stress_level <= 60) {
            await wait(1000 * 60 * 5);

            return;
        }

        await wait(1000 * 60 * 2);

        return;
    }
}
