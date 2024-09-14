import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { uuidv4 } from '../../core/utils';
import { NuiEvent } from '../../shared/event/nui';
import { Control } from '../../shared/input';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { TargetOption } from '../../shared/target';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { ScreenService } from '../screen.service';
import { TargetService } from './target.service';
import { TargetStore, TargetStoreBase } from './target.store';

const MAX_DISTANCE = 50;

@Provider()
export class TargetProvider {
    @Inject(TargetStore)
    private readonly targetStore: TargetStore;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(ScreenService)
    private readonly screenService: ScreenService;

    @Inject(TargetService)
    private readonly targetService: TargetService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    private _targetActive = false;
    private _targetFound = false;
    private _targetOptions: TargetOption[] = [];
    private _targetLocked: boolean;

    private _playerCoordsOverride: Vector3 | null;

    @Command('+target', {
        description: 'Activer le mode ciblage',
        keys: [{ mapper: 'keyboard', key: 'LMENU' }],
    })
    public async enableTargetMode(): Promise<void> {
        if (this._targetLocked) return;

        this._targetActive = true;
        this._targetFound = false;
        this.nuiDispatch.dispatch('target', 'SetTargeting', this._targetActive);
        await this.findTargets();
    }

    @Command('-target')
    public async disableTargetMode(force?: boolean): Promise<void> {
        if (!this._targetActive) return;
        if (!force && IsNuiFocused()) return;

        if (force) {
            this._targetLocked = true;
            setTimeout(() => (this._targetLocked = false), 1000);
        }

        await this.resetTarget();
    }

    @Tick()
    public async disableActionsDuringTarget(): Promise<void> {
        if (!this._targetActive) return;

        SetPauseMenuActive(false);
        DisablePlayerFiring(PlayerId(), true);

        if (this._targetFound) {
            DisableControlAction(0, Control.LookLeftRight, true);
            DisableControlAction(0, Control.LookUpDown, true);
        }

        DisableControlAction(0, Control.Attack, true);
        DisableControlAction(0, Control.Aim, true);
        DisableControlAction(0, Control.SelectWeapon, true);
        DisableControlAction(0, Control.Detonate, true);
        DisableControlAction(0, Control.ThrowGrenade, true);
        DisableControlAction(0, Control.MeleeAttackLight, true);
        DisableControlAction(0, Control.MeleeAttackHeavy, true);
        DisableControlAction(0, Control.MeleeAttackAlternate, true);
        DisableControlAction(0, Control.MeleeBlock, true);
        DisableControlAction(0, Control.Attack2, true);
        DisableControlAction(0, Control.MeleeAttack1, true);
        DisableControlAction(0, Control.MeleeAttack2, true);
    }

    public async findTargets(): Promise<void> {
        if (!this._targetActive) return;
        if (IsNuiFocused()) return;

        const [entity, coords] = await this.screenService.getEntityOnPosition([0.5, 0.5], this._playerCoordsOverride);
        const playerDistance = getDistance(coords, this.getPlayerCoords());

        this._targetOptions = [];

        const result = await this.checkTargetActions(entity, coords, playerDistance);
        this._targetOptions.push(...result);

        this._targetFound = this._targetOptions.length > 0;
        this.nuiDispatch.dispatch('target', 'SetTargetFound', this._targetFound);

        if (this._targetFound) {
            this.nuiDispatch.dispatch('target', 'SetTargets', this._targetOptions);
            SetCursorLocation(0.5, 0.5);
            return;
        }

        return this.findTargets();
    }

    @OnNuiEvent(NuiEvent.TargetReset)
    public async reset(): Promise<void> {
        return this.resetTarget();
    }

    @OnNuiEvent(NuiEvent.TargetSelect)
    public async select(id: string): Promise<void> {
        const option = this._targetOptions.find(t => t.id === id);
        if (!option) return;

        if (option.blackoutGlobal) {
            exports['soz-phone'].stopPhoneCall();
        }

        option?.action(option?.entity);

        return this.disableTargetMode(true);
    }

    public isActive(): boolean {
        return this._targetActive;
    }

    public setPlayerPosition(coords: Vector3 | null): void {
        this._playerCoordsOverride = coords;
    }

    protected async checkTargetActions(
        entity: number,
        coords: Vector3,
        playerDistance: number
    ): Promise<TargetOption[]> {
        const targetsFound: TargetOption[] = [];

        const entityTargets = await this.checkTargetEntityActions(entity, playerDistance);
        targetsFound.push(...entityTargets);

        const modelTargets = await this.checkTargetModelActions(entity, playerDistance);
        targetsFound.push(...modelTargets);

        const pedTargets = await this.checkTargetPedActions(entity, playerDistance);
        targetsFound.push(...pedTargets);

        const vehicleTargets = await this.checkTargetVehicleActions(entity, playerDistance);
        targetsFound.push(...vehicleTargets);

        const boneTargets = await this.checkTargetBoneActions(entity);
        targetsFound.push(...boneTargets);

        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const nearbyZones = this.targetStore.zones.find(zone =>
            'center' in zone.zone ? getDistance(zone.zone.center, playerPosition) <= MAX_DISTANCE : true
        );

        for (const { zone, targets, distance } of nearbyZones) {
            if (zone.debugPoly) zone.draw([0, 255, 0, 100], 0.5);
            if (playerDistance > distance) continue;

            if (zone.isPointInside(coords)) {
                for (const target of targets) {
                    const isValid = await this.targetService.validateTarget(target, entity);

                    if (isValid) {
                        // enforce citizen category to avoid issues with the migration
                        targetsFound.push({ category: 'citizen', ...target, id: uuidv4(), entity });
                    }
                }
            }
        }

        return targetsFound;
    }

    protected async checkTargetEntityActions(entity: number, playerDistance: number): Promise<TargetOption[]> {
        const entityType = GetEntityType(entity);
        if (entityType < 3) return [];

        const modelStore = this.targetStore.entities.get(entity.toString());

        return this.checkTargetGenericActions(modelStore, playerDistance, entity);
    }

    protected async checkTargetModelActions(entity: number, playerDistance: number): Promise<TargetOption[]> {
        const entityType = GetEntityType(entity);
        if (entityType === 0) return [];

        const model = this.targetStore.getId(GetEntityModel(entity));
        const modelStore = this.targetStore.models.get(model);

        return this.checkTargetGenericActions(modelStore, playerDistance, entity);
    }

    protected async checkTargetPedActions(entity: number, playerDistance: number): Promise<TargetOption[]> {
        const playerPed = PlayerPedId();
        if (entity === playerPed) return [];

        const entityType = GetEntityType(entity);
        if (entityType !== 1) return [];

        const player = this.playerService.getState();

        let pedStore = this.targetStore.peds.get('global');
        if (IsPedAPlayer(entity)) {
            if (player.isInHub) return [];

            pedStore = this.targetStore.players.get('global');
        }

        return this.checkTargetGenericActions(pedStore, playerDistance, entity);
    }

    protected async checkTargetVehicleActions(entity: number, playerDistance: number): Promise<TargetOption[]> {
        const entityType = GetEntityType(entity);
        if (entityType !== 2) return [];

        const vehicleStore = this.targetStore.vehicles.get('global');

        return this.checkTargetGenericActions(vehicleStore, playerDistance, entity);
    }

    protected async checkTargetBoneActions(entity: number): Promise<TargetOption[]> {
        const targetOptions: TargetOption[] = [];

        const playerCoords = this.getPlayerCoords();

        for (const [bone, store] of Object.entries(this.targetStore.bones.getAll())) {
            const boneId = GetEntityBoneIndexByName(entity, bone);
            const bonePos = GetWorldPositionOfEntityBone(entity, boneId) as Vector3;
            const boneDistance = getDistance(playerCoords, bonePos);

            const options = await this.checkTargetGenericActions(store, boneDistance, entity);
            targetOptions.push(...options);
        }

        return targetOptions;
    }

    protected async checkTargetGenericActions(
        store: TargetStoreBase,
        playerDistance: number,
        entity: number
    ): Promise<TargetOption[]> {
        const targetsFound: TargetOption[] = [];
        if (!store) return targetsFound;

        for (const target of store.targets) {
            if (playerDistance > target.distance) continue;

            const isValid = await this.targetService.validateTarget(target, entity);
            if (isValid) {
                // enforce citizen category to avoid issues with the migration
                targetsFound.push({ category: 'citizen', ...target, id: uuidv4(), entity });
            }
        }

        return targetsFound;
    }

    protected getPlayerCoords(): Vector3 {
        return this._playerCoordsOverride ?? (GetEntityCoords(PlayerPedId(), true) as Vector3);
    }

    protected async resetTarget(): Promise<void> {
        this._targetActive = false;
        this._targetFound = false;
        this._targetOptions = [];
        this.nuiDispatch.dispatch('target', 'SetTargeting', this._targetActive);
        this.nuiDispatch.dispatch('target', 'SetTargetFound', this._targetFound);
        this.nuiDispatch.dispatch('target', 'SetTargets', this._targetOptions);
    }
}
