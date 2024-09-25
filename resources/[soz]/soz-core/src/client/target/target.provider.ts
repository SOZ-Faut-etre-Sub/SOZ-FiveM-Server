import { Command } from '@core/decorators/command';
import { OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick } from '@core/decorators/tick';
import { uuidv4 } from '@core/utils';
import { Notifier } from '@public/client/notifier';

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

    @Inject(Notifier)
    private readonly notifier: Notifier;

    private _targetActive = false;
    private _targetFound = false;
    private _targetOptions: TargetOption[] = [];
    private _targetLocked: boolean;

    private _playerCoordsOverride: Vector3 | null;

    private _activeTargetedEntity: Array<number> = [];

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

    @Tick(50)
    public async checkTargetMode(): Promise<void> {
        if (!this._targetFound) return;

        const [entityId] = await this.screenService.getEntityOnPosition([0.5, 0.5], this._playerCoordsOverride);

        if (entityId !== 0) {
            this._activeTargetedEntity.push(entityId);
        }

        if (
            this._activeTargetedEntity.length >= 2 &&
            !this._targetOptions.some(t => this._activeTargetedEntity.includes(t.entity))
        ) {
            this._targetFound = false;
            setTimeout(() => this.resetTarget(), 2000);
        }

        if (this._activeTargetedEntity.length > 2) {
            this._activeTargetedEntity.shift();
        }
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

        const [entityId, entityCoords] = await this.screenService.getEntityOnPosition(
            [0.5, 0.5],
            this._playerCoordsOverride
        );
        const playerDistance = getDistance(entityCoords, this.getPlayerCoords());

        this._targetOptions = await this.checkTargetActions(entityId, entityCoords, playerDistance);

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

        const distance = getDistance(this.getPlayerCoords(), option.entityCoords);
        if (distance > option.distance) {
            this.notifier.error('Vous êtes trop loin pour effectuer cette action');
            return;
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
        entityCoords: Vector3,
        playerDistance: number
    ): Promise<TargetOption[]> {
        const targetsFound: TargetOption[] = [];

        const entityTargets = await this.checkTargetEntityActions(entity, entityCoords, playerDistance);
        targetsFound.push(...entityTargets);

        const modelTargets = await this.checkTargetModelActions(entity, entityCoords, playerDistance);
        targetsFound.push(...modelTargets);

        const pedTargets = await this.checkTargetPedActions(entity, entityCoords, playerDistance);
        targetsFound.push(...pedTargets);

        const vehicleTargets = await this.checkTargetVehicleActions(entity, entityCoords, playerDistance);
        targetsFound.push(...vehicleTargets);

        const boneTargets = await this.checkTargetBoneActions(entity);
        targetsFound.push(...boneTargets);

        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const nearbyZones = this.targetStore.zones.find(([, { zone }]) =>
            'center' in zone ? getDistance(zone.center, playerPosition) <= MAX_DISTANCE : true
        );

        if (nearbyZones && nearbyZones.length > 0) {
            for (const [, { zone, targets, distance }] of nearbyZones) {
                if (zone.debugPoly) zone.draw([0, 255, 0, 100], 0.5);
                if (playerDistance > distance) continue;

                if (zone.isPointInside(entityCoords)) {
                    for (const target of targets) {
                        const isValid = await this.targetService.validateTarget(target, entity);

                        if (isValid) {
                            // enforce citizen category to avoid issues with the migration
                            targetsFound.push({ category: 'citizen', ...target, id: uuidv4(), entity, entityCoords });
                        }
                    }
                }
            }
        }

        return targetsFound;
    }

    protected async checkTargetEntityActions(
        entity: number,
        entityCoords: Vector3,
        playerDistance: number
    ): Promise<TargetOption[]> {
        const entityType = GetEntityType(entity);
        if (entityType < 3) return [];

        const entityStore = this.targetStore.entities.find(([, target]) => target.entity === entity);

        return this.checkTargetGenericActions(entityStore, playerDistance, entity, entityCoords);
    }

    protected async checkTargetModelActions(
        entity: number,
        entityCoords: Vector3,
        playerDistance: number
    ): Promise<TargetOption[]> {
        const entityType = GetEntityType(entity);
        if (entityType === 0) return [];

        const model = this.targetStore.getId(GetEntityModel(entity));
        const modelStore = this.targetStore.models.find(([, target]) => target.model.toString() === model.toString());

        return this.checkTargetGenericActions(modelStore, playerDistance, entity, entityCoords);
    }

    protected async checkTargetPedActions(
        entity: number,
        entityCoords: Vector3,
        playerDistance: number
    ): Promise<TargetOption[]> {
        const playerPed = PlayerPedId();
        if (entity === playerPed) return [];

        const entityType = GetEntityType(entity);
        if (entityType !== 1) return [];

        const player = this.playerService.getState();

        if (IsPedAPlayer(entity)) {
            if (player.isInHub) return [];

            const playerStore = this.targetStore.players.find(([, target]) => target.player === -1);
            return this.checkTargetGenericActions(playerStore, playerDistance, entity, entityCoords);
        }

        const pedStore = this.targetStore.peds.find(([, target]) => target.ped === -1);
        return this.checkTargetGenericActions(pedStore, playerDistance, entity, entityCoords);
    }

    protected async checkTargetVehicleActions(
        entity: number,
        entityCoords: Vector3,
        playerDistance: number
    ): Promise<TargetOption[]> {
        const entityType = GetEntityType(entity);
        if (entityType !== 2) return [];

        const vehicleStore = this.targetStore.vehicles.find(([, target]) => target.vehicle === -1);

        return this.checkTargetGenericActions(vehicleStore, playerDistance, entity, entityCoords);
    }

    protected async checkTargetBoneActions(entity: number): Promise<TargetOption[]> {
        const targetOptions: TargetOption[] = [];

        const playerCoords = this.getPlayerCoords();

        for (const [id, store] of this.targetStore.bones.getAll()) {
            const boneId = GetEntityBoneIndexByName(entity, store.bone);
            const bonePos = GetWorldPositionOfEntityBone(entity, boneId) as Vector3;
            const boneDistance = getDistance(playerCoords, bonePos);

            const options = await this.checkTargetGenericActions([[id, store]], boneDistance, entity, bonePos);
            targetOptions.push(...options);
        }

        return targetOptions;
    }

    protected async checkTargetGenericActions(
        store: [string, TargetStoreBase][],
        playerDistance: number,
        entity: number,
        entityCoords: Vector3
    ): Promise<TargetOption[]> {
        const targetsFound: TargetOption[] = [];
        if (!store || store.length === 0) return targetsFound;

        for (const [, targetStore] of store) {
            for (const target of targetStore.targets) {
                if (playerDistance > target.distance) continue;

                const isValid = await this.targetService.validateTarget(target, entity);
                if (isValid) {
                    // enforce citizen category to avoid issues with the migration
                    targetsFound.push({ category: 'citizen', ...target, id: uuidv4(), entity, entityCoords });
                }
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
        this._activeTargetedEntity = [];
        this.nuiDispatch.dispatch('target', 'SetTargeting', this._targetActive);
        this.nuiDispatch.dispatch('target', 'SetTargetFound', this._targetFound);
        this.nuiDispatch.dispatch('target', 'SetTargets', this._targetOptions);
    }
}
