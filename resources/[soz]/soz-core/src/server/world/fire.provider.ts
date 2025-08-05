import { Inject } from '@public/core/decorators/injectable';
import { Logger } from '@public/core/logger';
import { wait } from '@public/core/utils';
import { joaat } from '@public/shared/joaat';
import { RpcClientEvent } from '@public/shared/rpc';
import { Gauge } from 'prom-client';

import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitClientRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import {
    FirePit,
    firePitDefaultHealth,
    firePitGrid,
    firePitSound,
    firePitVolume,
    fireScale,
    FireTreeModelMapping,
    FireType,
    increaseFirePitChance,
    newFireOffset,
    newFirePitChance,
    validFirePropagationZone,
} from '../../shared/fire';
import { getDistance, Point3D, Vector2, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getRandomInt } from '../../shared/random';
import { RpcServerEvent } from '../../shared/rpc';
import { LockService } from '../lock.service';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { QBCore } from '../qbcore';
import { ModelSwapRepository } from '../repository/modelswap.repository';
import { SoundService } from '../sound/sound.service';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';

const PLAYER_RADIUS = 1000;
const MAX_FIRE_PIT_WEIGHT = 120;
const INVINCIBILITY_TIME_AFTER_REDUCE = 5_000;

@Provider()
export class FireProvider {
    @Inject(QBCore)
    private readonly qbCore: QBCore;

    @Inject(PermissionService)
    private readonly permissionService: PermissionService;

    @Inject(PlayerPositionProvider)
    private readonly playerPositionProvider: PlayerPositionProvider;

    @Inject(ModelSwapRepository)
    private readonly modelSwapRepository: ModelSwapRepository;

    @Inject(VehicleSpawner)
    private readonly vehicleSpawner: VehicleSpawner;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(Logger)
    private readonly logger: Logger;

    @Inject(SoundService)
    private readonly soundService: SoundService;

    @Inject(LockService)
    private readonly lockService: LockService;

    private firePitGauge = new Gauge({
        name: 'soz_firestorm_pit',
        help: 'Firestorm pit',
        labelNames: ['chunk'],
    });

    private readonly gridSize = 25;
    private staffRequestPitExtinguish = false;
    private firePropagationEnabled = true;

    private firePits = new Map<string, FirePit>();
    private firePitHealth = new Map<string, number>();
    private firePitAlreadyReduced = new Set<string>();
    private firePitAlreadySpawned = new Set<string>();
    private firePitLastReduced = new Map<string, number>();

    public propagationIsEnabled(): boolean {
        return this.firePropagationEnabled;
    }

    @Rpc(RpcServerEvent.FIRE_GET_ALL_PITS)
    async getAllPits() {
        return Object.fromEntries(this.firePits.entries());
    }

    @Rpc(RpcServerEvent.FIRE_EXTINGUISHED)
    async extinguishFire(source: number, id: string) {
        await this.reduceFirePit(id);
    }

    @OnEvent(ServerEvent.ADMIN_FIRE_PROPAGATION)
    async toggleFirePropagation(source: number, enabled: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.firePropagationEnabled = enabled;

        this.notifier.notify(source, `La propagation des foyers est maintenant ${enabled ? 'activée' : 'désactivé'}`);
        this.logger.debug(`[World - Fire] Fire propagation is now ${enabled ? 'enabled' : 'disabled'}`);
    }

    @OnEvent(ServerEvent.ADMIN_STAR_NEW_FIRE_PIT)
    async startNewFirePit(source: number, position: Vector4, type: FireType, duration: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        const endAt = duration > 0 ? Date.now() + duration * 60000 : undefined;

        await this.createNewFirePit(position, type, endAt);
    }

    @OnEvent(ServerEvent.ADMIN_FORCE_PIT_EXTINGUISH)
    async extinguishFirePit(source: number, instant: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.staffRequestPitExtinguish = true;

        if (!instant) return;

        this.firePits.forEach((pit, id) => {
            TriggerLatentClientEvent(ClientEvent.FIRE_PIT_DESPAWN, -1, 16 * 1024, id);
            this.soundService.stopGlobal(`firepit-${id}-${pit.type}`);
            this.firePits.delete(id);
            this.firePitHealth.delete(id);
            this.firePitGauge.remove({ chunk: id });
        });
    }

    @Tick(10_000)
    async onFireRespawnCheck() {
        for (const id of this.firePits.keys()) {
            if (this.staffRequestPitExtinguish) {
                await this.reduceFirePit(id);
                await wait(10);
                await this.reduceFirePit(id);
            }
        }
    }

    @Tick(TickInterval.EVERY_MINUTE / 2)
    async onPropagationCheck() {
        if (this.firePits.size === 0 && this.firePitAlreadySpawned.size > 0) {
            this.firePitAlreadySpawned.clear();
            this.firePitAlreadyReduced.clear();
            this.staffRequestPitExtinguish = false;
        }

        for (const [id, pit] of this.firePits.entries()) {
            if (this.staffRequestPitExtinguish) {
                continue;
            }

            if (pit.endAt) {
                const remainingTime = (pit.endAt - Date.now()) / 30000;
                const remainingHealth = [FireType.Small, FireType.Medium, FireType.Huge].reduce((acc, type) => {
                    if (type > pit.type) return acc;
                    return acc + firePitDefaultHealth[type];
                }, 0);

                if (remainingTime <= remainingHealth) {
                    await this.reduceFirePit(id);
                    continue;
                }
            }

            const canIncrease = getRandomInt(0, 100) <= increaseFirePitChance[pit.type];
            if (canIncrease) {
                await this.increaseFirePit(id);
            }

            if (pit.type === FireType.Small) {
                continue;
            }

            if (!this.firePropagationEnabled) {
                continue;
            }

            if (!this.canSpawnMoreFirePits()) {
                this.logger.debug(`[World - Fire] Too many fire pits, stop propagating [${this.firePits.size}]`);
                break;
            }

            const canPropagate = getRandomInt(0, 100) <= newFirePitChance[pit.type];
            if (!canPropagate) {
                this.logger.debug(`[World - Fire] Fire pit ${id} can't propagate more for now`);
                continue;
            }

            const nearPlayer = this.getNearPlayer(pit.position, PLAYER_RADIUS);
            if (!nearPlayer) {
                this.logger.debug(`[World - Fire] No player near fire pit ${id}`);
                continue;
            }

            try {
                const [, degrees] = await emitClientRpc<[number, number]>(
                    RpcClientEvent.FIRE_GET_WIND_DATA,
                    nearPlayer
                );

                const newPitCoords = this.generateNewFirePitCoords(pit, degrees);
                if (!newPitCoords) {
                    this.logger.debug(`[World - Fire] No valid fire pit position for fire pit ${id}`);
                    continue;
                }

                const [isValid, newPitZ] = await emitClientRpc<[boolean, number]>(
                    RpcClientEvent.FIRE_GET_Z,
                    nearPlayer,
                    newPitCoords
                );

                if (!isValid) {
                    this.logger.debug(`[World - Fire] No valid fire pit Z for fire pit ${id}`);
                    continue;
                }

                newPitCoords[2] = newPitZ;

                const newPitId = await this.createNewFirePit(newPitCoords, FireType.Medium, pit.endAt);
                if (newPitId) {
                    this.logger.debug(`[World - Fire] Fire pit ${id} propagated to fire pit ${newPitId}`);
                    break; // Propagate only one pit during a propagation check
                }
            } catch (e) {
                this.logger.debug(`[World - Fire] Error while getting wind data for fire pit ${id} : ${e.message}`);
            }
        }
    }

    /* Fire pit management */
    private async createNewFirePit(position: Vector4, type: FireType, endAt?: number) {
        const id = this.getChunkId(position);

        return this.lockService.lock(`firepit-${id}`, async () => {
            if (this.firePits.has(id)) {
                this.logger.debug(`[World - Fire] Fire pit ${id} already exists`);
                return;
            }

            if (this.staffRequestPitExtinguish) {
                return;
            }

            this.firePits.set(id, {
                position,
                type,
                endAt: endAt,
            });
            this.firePitHealth.set(id, firePitDefaultHealth[type]);
            this.firePitGauge.set({ chunk: id }, firePitDefaultHealth[type]);
            this.firePitAlreadySpawned.add(id);

            this.logger.debug(`[World - Fire] Create new pit ${id}`);

            TriggerLatentClientEvent(ClientEvent.FIRE_PIT_SPAWN, -1, 16 * 1024, id, {
                position,
                type,
            });

            this.soundService.playGlobal({
                id: `firepit-${id}-${type}`,
                name: 'fire',
                location: position.slice(0, 3) as Vector3,
                maxDistance: firePitSound[type],
                volume: firePitVolume[type],
            });

            await this.addSwapModel(type, position);

            return id;
        });
    }

    private async increaseFirePit(id: string) {
        return this.lockService.lock(`firepit-${id}`, async () => {
            const pit = this.firePits.get(id);

            if (this.firePitHealth.get(id) < firePitDefaultHealth[pit.type]) {
                return;
            }

            if (this.firePitAlreadyReduced.has(id)) return;
            if (this.staffRequestPitExtinguish) return;

            const newPitType = Math.min(pit.type + 1, FireType.Huge);
            this.firePits.set(id, { ...pit, type: newPitType });
            this.firePitHealth.set(id, firePitDefaultHealth[newPitType]);
            this.firePitGauge.set({ chunk: id }, firePitDefaultHealth[newPitType]);

            TriggerLatentClientEvent(ClientEvent.FIRE_PIT_UPDATE, -1, 16 * 1024, id, {
                ...this.firePits.get(id),
                health: this.firePitHealth.get(id),
            });

            this.soundService.stopGlobal(`firepit-${id}-${pit.type}`);
            this.soundService.playGlobal({
                id: `firepit-${id}-${newPitType}`,
                name: 'fire',
                location: pit.position.slice(0, 3) as Vector3,
                maxDistance: firePitSound[newPitType],
                volume: firePitVolume[newPitType],
            });

            this.logger.debug(`[World - Fire] Fire pit ${id} increase its intensity`);
        });
    }

    private async reduceFirePit(id: string) {
        return this.lockService.lock(`firepit-${id}`, async () => {
            if (!this.firePits.has(id)) return;
            if (
                !this.firePitAlreadyReduced &&
                this.firePitLastReduced.get(id) + INVINCIBILITY_TIME_AFTER_REDUCE > Date.now()
            ) {
                return;
            }

            const newFirePitHealth = Math.max(this.firePitHealth.get(id) - 1, 0);

            this.firePitHealth.set(id, newFirePitHealth);
            this.firePitAlreadyReduced.add(id);

            this.firePitGauge.set({ chunk: id }, newFirePitHealth);

            this.logger.debug(`[World - Fire] Fire pit ${id} reduced its health to ${newFirePitHealth}`);

            this.firePitLastReduced.set(id, Date.now());

            if (newFirePitHealth > 0) {
                const pit = this.firePits.get(id);

                TriggerLatentClientEvent(ClientEvent.FIRE_PIT_UPDATE, -1, 16 * 1024, id, {
                    ...pit,
                    health: newFirePitHealth,
                });

                return;
            }

            const pit = this.firePits.get(id);

            if (Number(pit.type) === FireType.Small) {
                this.firePits.delete(id);
                this.firePitHealth.delete(id);
                this.firePitGauge.remove({ chunk: id });

                TriggerLatentClientEvent(ClientEvent.FIRE_PIT_DESPAWN, -1, 16 * 1024, id);
                this.soundService.stopGlobal(`firepit-${id}-${pit.type}`);

                this.logger.debug(`[World - Fire] Fire pit ${id} removed`);
                return;
            }

            const newPitType = Math.max(FireType.Small, pit.type - 1);
            this.firePits.set(id, { ...pit, type: newPitType });
            this.firePitHealth.set(id, firePitDefaultHealth[newPitType]);
            this.firePitGauge.set({ chunk: id }, firePitDefaultHealth[newPitType]);

            TriggerLatentClientEvent(ClientEvent.FIRE_PIT_UPDATE, -1, 16 * 1024, id, {
                ...this.firePits.get(id),
                health: firePitDefaultHealth[newPitType],
            });

            this.soundService.stopGlobal(`firepit-${id}-${pit.type}`);
            this.soundService.playGlobal({
                id: `firepit-${id}-${newPitType}`,
                name: 'fire',
                location: pit.position.slice(0, 3) as Vector3,
                maxDistance: firePitSound[newPitType],
                volume: firePitVolume[newPitType],
            });

            this.logger.debug(`[World - Fire] Fire pit ${id} reduce its intensity`);
        });
    }

    /* Helpers */
    private canSpawnMoreFirePits(): boolean {
        let weight = MAX_FIRE_PIT_WEIGHT;
        this.firePits.forEach(firePit => {
            weight -= firePitGrid[firePit.type];
        });

        return weight >= firePitGrid[FireType.Huge];
    }

    private getNearPlayer(position: Vector4, maxRadius: number): number | null {
        for (const player of this.qbCore.getPlayersSources()) {
            const playerPosition = this.playerPositionProvider.getPlayerPosition(player);
            if (!playerPosition) continue;

            if (getDistance(position, playerPosition) > maxRadius) continue;

            return player;
        }

        return null;
    }

    private generateNewFirePitCoords(pit: FirePit, windHeading: number): Vector4 | null {
        const maxIteration = 20;
        const nearChunks = this.getNearChunks(pit.position, firePitGrid[pit.type]);

        if (nearChunks.length === 0) {
            return null;
        }

        for (let i = 0; i < maxIteration; i++) {
            const spreadConeAngle = 45; // Fire spreads in a cone
            const randomAngle = getRandomInt(-spreadConeAngle, spreadConeAngle);
            const propagationAngle = (windHeading + randomAngle) * (Math.PI / 180);

            const totalDistance = getRandomInt(newFireOffset[pit.type][0], newFireOffset[pit.type][1]);

            const offsetX = Math.sin(propagationAngle) * totalDistance;
            const offsetY = Math.cos(propagationAngle) * totalDistance;

            const newPitCoords: Vector4 = [
                pit.position[0] + offsetX,
                pit.position[1] + offsetY,
                pit.position[2],
                windHeading + getRandomInt(-90, 90),
            ];

            const newPitChunkId = this.getChunkId(newPitCoords);

            if (
                nearChunks.includes(newPitChunkId) &&
                validFirePropagationZone.isPointInside(newPitCoords.slice(0, 3) as Point3D)
            ) {
                return newPitCoords;
            }
        }

        return null;
    }

    // Private custom grid
    private getGridChunk(x: number): number {
        return Math.floor((x + 8192) / this.gridSize);
    }

    private getChunkId(v: Vector2 | Vector3 | Vector4): string {
        const x = this.getGridChunk(v[0]);
        const y = this.getGridChunk(v[1]);

        return String((x << 16) | y);
    }

    private getNearChunks(v: Vector2 | Vector3 | Vector4, deltaX: number): string[] {
        const chunks: string[] = [];

        const currentChunk = this.getChunkId(v);

        for (const delta of this.getDelta(deltaX)) {
            const chunkSize = [v[0] + delta[0] * this.gridSize, v[1] + delta[1] * this.gridSize] as Vector2;
            const chunkId = this.getChunkId(chunkSize);

            if (
                chunks.includes(chunkId) ||
                this.firePits.has(chunkId) ||
                this.firePitAlreadySpawned.has(chunkId) ||
                chunkId === currentChunk
            ) {
                continue;
            }

            chunks.push(chunkId);
        }

        return chunks;
    }

    private getDelta(x: number): number[][] {
        const deltas: number[][] = [];

        for (let i = -x; i <= x; i++) {
            for (let j = -x; j <= x; j++) {
                deltas.push([i, j]);
            }
        }

        return deltas;
    }

    private async addSwapModel(type: FireType, position: Vector4) {
        for (const [sourceModel, targetModel] of Object.entries(FireTreeModelMapping)) {
            await this.modelSwapRepository.addSwap({
                id: 0,
                position: [position[0], position[1], position[2]],
                source: sourceModel,
                target: targetModel,
                range: fireScale[type] * 8,
            });
        }
    }

    @OnEvent(ServerEvent.ADMIN_FIRE_REMOVE_MODELSWAP)
    public async removeModelSwap(source: number, position: Vector3, range: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        const models = Object.keys(FireTreeModelMapping);
        const swaps = await this.modelSwapRepository.get();
        for (const swap of swaps) {
            if (!models.includes(swap.source)) {
                continue;
            }

            if (getDistance(position, swap.position) > range) {
                continue;
            }

            if (swap.target !== FireTreeModelMapping[swap.source]) {
                continue;
            }

            this.modelSwapRepository.removeSwap(swap.id);
        }
    }

    @OnEvent(ServerEvent.FIRETRUCK_TAKEOUT)
    public async onRentFireTruck(source: number, position: Vector4) {
        await this.vehicleSpawner.spawnRentVehicle(source, 'firetruk', {
            position,
            open: true,
        });

        this.notifier.notify(
            source,
            `Voilà de quoi sauver Los Santos des flammes, n'oublie pas de le ramener pour qu'il puisse servir à d'autres.`,
            'success'
        );
    }

    @OnEvent(ServerEvent.FIRETRUCK_RETURN)
    public async onReturnFireTruck(source: number, networkId: number) {
        const entityId = NetworkGetEntityFromNetworkId(networkId);
        if (GetEntityModel(entityId) !== joaat('firetruk')) {
            return;
        }

        await this.vehicleSpawner.delete(networkId);

        this.notifier.notify(source, `Merci pour votre service.`, 'success');
    }
}
