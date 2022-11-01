import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { ServerEvent } from '../../../shared/event';
import { FuelStation, FuelStationType, FuelType } from '../../../shared/fuel';
import { JobPermission, JobType } from '../../../shared/job';
import { Vector3 } from '../../../shared/polyzone/vector';
import { RpcEvent } from '../../../shared/rpc';
import { PrismaService } from '../../database/prisma.service';
import { InventoryManager } from '../../item/inventory.manager';
import { JobService } from '../../job.service';
import { Notifier } from '../../notifier';
import { PlayerMoneyService } from '../../player/player.money.service';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class OilStationProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Rpc(RpcEvent.OIL_GET_STATION)
    public async getStation(source: number, stationId: number): Promise<FuelStation | null> {
        const station = await this.prismaService.fuel_storage.findUnique({
            where: {
                id: stationId,
            },
        });

        if (!station) {
            return null;
        }

        const stationPosition = JSON.parse(station.position) as { x: number; y: number; z: number };
        const stationZone = JSON.parse(station.zone);

        const position = [stationPosition.x, stationPosition.y, stationPosition.z] as Vector3;
        const zone = {
            center: [stationZone.position.x, stationZone.position.y, stationZone.position.z] as Vector3,
            length: stationZone.length,
            width: stationZone.width,
            heading: stationZone.options.heading,
            minZ: stationZone.options.minZ,
            maxZ: stationZone.options.maxZ,
        };

        return {
            fuel: station.fuel as FuelType,
            job: station.owner as JobType,
            model: station.model,
            position,
            zone,
            stock: station.stock,
            type: station.type as FuelStationType,
            id: station.id,
            name: station.station,
            price: station.price,
        };
    }

    @Rpc(RpcEvent.OIL_GET_STATION_PRICES)
    public async getStationPrices(): Promise<Record<FuelType, number>> {
        const stations = await this.prismaService.fuel_storage.groupBy({
            by: ['fuel'],
            _avg: {
                price: true,
            },
            where: {
                type: FuelStationType.Public,
            },
        });

        const prices = {};

        for (const station of stations) {
            prices[station.fuel as FuelType] = station._avg.price;
        }

        return prices as Record<FuelType, number>;
    }

    @OnEvent(ServerEvent.OIL_SET_STATION_PRICE)
    public async setStationPrice(source: number, price: number, type: FuelType): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!this.jobService.hasPermission(player, JobType.Oil, JobPermission.FuelerChangePrice)) {
            this.notifier.notify(source, "Vous n'avez pas la permission de faire ça.", 'error');

            return;
        }

        await this.prismaService.fuel_storage.updateMany({
            where: {
                fuel: type,
                type: FuelStationType.Public,
            },
            data: {
                price,
            },
        });

        this.notifier.notify(source, `Vous avez changé le prix de l'essence à $${price}.`);
    }

    @OnEvent(ServerEvent.OIL_REFILL_ESSENCE_STATION)
    public async refillEssenceStation(
        source: number,
        stationId: number,
        amount: number,
        vehicleNetworkId: number
    ): Promise<void> {
        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntityId);

        if (!state) {
            return;
        }

        const itemCount = Math.ceil(amount / 10);
        const availableCount = this.inventoryManager.getItem(`trunk_` + state.plate, 'essence');

        if (itemCount > availableCount) {
            this.notifier.notify(source, "Vous n'avez pas assez d'essence dans la citerne.");

            return;
        }

        this.notifier.notify(source, 'Vous avez ~g~relié~s~ là citerne à ~g~la station service~s~.');

        const { progress } = await this.progressService.progress(
            source,
            'fill',
            'Rechargement en cours',
            20000,
            {
                dictionary: 'timetable@gardener@filling_can',
                name: 'gar_ig_5_filling_can',
                options: {
                    repeat: true,
                },
            },
            {
                disableMovement: true,
                disableCombat: true,
            }
        );

        const refilled = Math.ceil(amount * progress);
        const itemUsed = Math.ceil(refilled / 10);

        if (!this.inventoryManager.removeItemFromInventory(`trunk_` + state.plate, 'essence', itemUsed)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'essence dans la citerne.");

            return;
        }

        await this.playerMoneyService.transfer('farm_mtp', 'safe_oil', refilled * 3);

        this.notifier.notify(source, `Vous avez ~g~ajouté~s~ ${refilled}L d'essence dans la station.`);

        await this.prismaService.fuel_storage.update({
            where: {
                id: stationId,
            },
            data: {
                stock: {
                    increment: refilled,
                },
            },
        });

        TriggerClientEvent('jobs:client:fueler:CancelTankerRefill', source);
    }

    @OnEvent(ServerEvent.OIL_REFILL_KEROSENE_STATION)
    public async refillKeroseneStation(source: number, stationId: number, amount: number): Promise<void> {
        const itemCount = Math.ceil(amount / 10);
        const availableCount = this.inventoryManager.getItem(source, 'kerosene');

        if (itemCount > availableCount) {
            this.notifier.notify(source, "Vous n'avez pas assez de kérosène.");

            return;
        }

        const { progress } = await this.progressService.progress(
            source,
            'fill',
            'Vous remplissez...',
            20000,
            {
                dictionary: 'timetable@gardener@filling_can',
                name: 'gar_ig_5_filling_can',
                options: {
                    repeat: true,
                },
            },
            {
                disableMovement: true,
                disableCombat: true,
            }
        );

        const refilled = Math.ceil(amount * progress);
        const itemUsed = Math.ceil(refilled / 10);

        if (!this.inventoryManager.removeItemFromInventory(source, 'kerosene', itemUsed)) {
            this.notifier.notify(source, "Vous n'avez pas assez de kérosène.");

            return;
        }

        await this.playerMoneyService.transfer('farm_mtp', 'safe_oil', refilled * 0.5);

        this.notifier.notify(source, `Vous avez ~g~ajouté~s~ ${refilled}L de kérosène dans la station.`);

        await this.prismaService.fuel_storage.update({
            where: {
                id: stationId,
            },
            data: {
                stock: {
                    increment: refilled,
                },
            },
        });
    }
}
