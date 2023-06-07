import { PlayerTalentService } from '@private/server/player/player.talent.service';
import { waitUntil } from '@public/core/utils';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { LockPickAlertChance } from '@public/shared/vehicle/vehicle';

import { Once, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem, Item } from '../../shared/item';
import { getRandomInt } from '../../shared/random';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { VehiclePlayerRepository } from './vehicle.player.repository';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleLockProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehiclePlayerRepository)
    private vehiclePlayerRepository: VehiclePlayerRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerTalentService)
    private playerTalentService: PlayerTalentService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    private trunkOpened: Record<number, Set<number>> = {};

    @Once()
    public onStart() {
        this.item.setItemUseCallback('lockpick', this.useLockpick.bind(this));
        this.item.setItemUseCallback('lockpick_low', this.useLockpick.bind(this));
        this.item.setItemUseCallback('lockpick_medium', this.useLockpick.bind(this));
        this.item.setItemUseCallback('lockpick_high', this.useLockpick.bind(this));
    }

    @OnEvent(ServerEvent.VEHICLE_SET_OPEN)
    public onVehicleSetOpen(source: number, vehicleNetworkId: number, isOpen: boolean) {
        this.vehicleStateService.updateVehicleVolatileState(
            vehicleNetworkId,
            {
                open: isOpen,
            },
            null,
            true
        );

        this.vehicleStateService.handleVehicleOpenChange(vehicleNetworkId);
    }

    @Rpc(RpcServerEvent.VEHICLE_GET_OPENED)
    public getVehicleOpened(): number[] {
        return [...this.vehicleStateService.vehicleOpened];
    }

    public async useLockpick(source: number, item: Item, inventoryItem: InventoryItem): Promise<void> {
        if (this.item.isItemExpired(inventoryItem)) {
            this.notifier.notify(source, 'Le lockpick est cassé', 'error');

            return;
        }

        const lockPickDuration = 10000; // 10 seconds
        const percentages = {
            lockpick_low: 75,
            lockpick_medium: 95,
            lockpick_high: 100,
            lockpick: 100,
        };

        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (null === closestVehicle || closestVehicle.distance > 3) {
            this.notifier.notify(source, 'Aucun véhicule à proximité', 'error');

            return;
        }

        if (item.name === 'lockpick' && inventoryItem.metadata?.type) {
            const model = GetEntityModel(closestVehicle.vehicleEntityId);
            if (GetHashKey(inventoryItem.metadata?.model) !== model) {
                this.notifier.notify(source, 'Ce lockpick ne peux pas crocheter ce véhicule', 'error');

                return;
            }
        }

        const vehicleType = GetVehicleType(closestVehicle.vehicleEntityId);

        if (vehicleType !== 'automobile' && vehicleType !== 'bike' && vehicleType !== 'trailer') {
            this.notifier.notify(source, 'Vous ne pouvez pas crocheter ce véhicule', 'error');

            return;
        }

        if (!this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            this.notifier.notify(source, 'Aucun lockpick', 'error');

            return;
        }

        const ped = GetPlayerPed(source);

        waitUntil(
            async () =>
                getDistance(
                    GetEntityCoords(ped) as Vector3,
                    GetEntityCoords(closestVehicle.vehicleEntityId) as Vector3
                ) > 3.0,
            lockPickDuration
        ).then(isTooFar => {
            if (isTooFar) {
                this.notifier.notify(source, 'Le véhicule est trop loin pour être crocheté', 'error');
                this.progressService.stopProgress(source);
            }
        });

        if (Math.random() < LockPickAlertChance) {
            TriggerClientEvent(ClientEvent.VEHICLE_LOCKPICK, source, 'lockpick');
        }

        const { completed } = await this.progressService.progress(
            source,
            'Lockpick',
            'Crochetage du véhicule',
            lockPickDuration,
            {
                dictionary: 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@',
                name: 'machinic_loop_mechandplayer',
            },
            { useAnimationService: true }
        );

        if (!completed) {
            return;
        }

        const random = getRandomInt(0, 100);
        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleNetworkId);

        if (
            random > percentages[item.name] ||
            (vehicleState.volatile.isPlayerVehicle && item.name != 'lockpick_high')
        ) {
            this.notifier.notify(source, "Vous n'avez pas réussi à crocheter le véhicule", 'error');

            return;
        }

        if (vehicleState.volatile.isPlayerVehicle) {
            const playerVehicle = await this.prismaService.playerVehicle.findUnique({
                where: { plate: vehicleState.volatile.plate },
            });
            if (playerVehicle.job) {
                this.notifier.notify(
                    source,
                    '~r~Le véhicule déverrouillé appartient visiblement à une entreprise en ville',
                    'warning'
                );
            } else {
                this.notifier.notify(
                    source,
                    "~r~Le véhicule déverrouillé appartient visiblement à quelqu'un en ville",
                    'warning'
                );
            }
        }

        this.vehicleStateService.updateVehicleVolatileState(closestVehicle.vehicleNetworkId, {
            forced: true,
        });

        this.vehicleStateService.handleVehicleOpenChange(closestVehicle.vehicleNetworkId);

        this.notifier.notify(source, 'Le véhicule a été forcé.', 'success');
    }

    @OnEvent(ServerEvent.VEHICLE_SET_TRUNK_STATE)
    async onSetTrunkState(source: number, vehicleNetworkId: number, state: boolean) {
        const set = this.trunkOpened[vehicleNetworkId] || new Set();

        if (state) {
            set.add(source);
        } else {
            set.delete(source);
        }

        this.trunkOpened[vehicleNetworkId] = set;

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const owner = NetworkGetEntityOwner(entityId);

        if (!owner) {
            return;
        }

        if (set.size > 0) {
            TriggerClientEvent(ClientEvent.VEHICLE_SET_TRUNK_STATE, owner, vehicleNetworkId, true);
        } else {
            TriggerClientEvent(ClientEvent.VEHICLE_SET_TRUNK_STATE, owner, vehicleNetworkId, false);
            delete this.trunkOpened[vehicleNetworkId];
        }
    }

    @OnEvent(ServerEvent.VEHICLE_TAKE_OWNER)
    private onVehicleTakeOwner(source: number, vehicleNetworkId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const plate = GetVehicleNumberPlateText(vehicleEntityId);

        this.vehicleStateService.addVehicleKey(plate, player.citizenid);
        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
            open: true,
            owner: player.citizenid,
        });

        this.vehicleStateService.handleVehicleOpenChange(vehicleNetworkId);
    }

    @OnEvent(ServerEvent.PLAYER_UPDATE_HAT_VEHICLE)
    async onPlayerUpdateHatVehicle(source: number, hat: number, texture: number) {
        const entity = GetPlayerPed(source);

        if (!entity) {
            return;
        }

        SetPedPropIndex(entity, 0, hat, texture, true);
    }

    @Rpc(RpcServerEvent.VEHICLE_HAS_KEY)
    public async hasVehicleKey(source: number, vehicleId: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        const vehicle = await this.vehiclePlayerRepository.find(vehicleId);

        if (!vehicle) {
            return false;
        }

        return this.vehicleStateService.hasVehicleKey(vehicle.plate, player.citizenid);
    }

    @OnEvent(ServerEvent.VEHICLE_FORCE_OPEN)
    async onForceOpen(source: number, vehicleNetworkId: number) {
        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
            forced: true,
        });

        this.vehicleStateService.handleVehicleOpenChange(vehicleNetworkId);
    }
}
