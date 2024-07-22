import { GarageList } from '@public/config/garage';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { VehicleHandlingType } from '@public/shared/vehicle/modification';
import { VehicleClass } from '@public/shared/vehicle/vehicle';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { ADD_ERROR_MESSAGE } from '../../shared/inventory';
import { isErr } from '../../shared/result';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @OnEvent(ServerEvent.ADMIN_ADD_VEHICLE)
    public async addVehicle(source: number, model: string, name: string, vehClass: VehicleClass, mods: any[]) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        let garage = 'airport_public';
        switch (vehClass) {
            case VehicleClass.Boats:
                garage = 'docks_boat';
                break;
            case VehicleClass.Planes:
            case VehicleClass.Helicopters:
                garage = 'airport_public_air';
                break;
            default:
                garage = 'airport_public';
                break;
        }

        await this.prismaService.playerVehicle.create({
            data: {
                license: player.license,
                citizenid: player.citizenid,
                vehicle: name,
                hash: model.toString(),
                mods: JSON.stringify(mods),
                plate: await this.vehicleService.generatePlate(),
                garage: garage,
                state: 1,
                boughttime: Math.floor(new Date().getTime() / 1000),
                parkingtime: Math.floor(new Date().getTime() / 1000),
            },
        });

        const garageConfig = GarageList[garage];

        this.notifier.notify(source, 'Une version de ce véhicule ~g~a été ajouté~s~ au ' + garageConfig.name);
    }

    @OnEvent(ServerEvent.VEHICLE_COLLECT_FINGERPRINT)
    public async collectFingerprint(source: number, vehicleNetworkId: number, zone: string, model: string) {
        const fingerprint = this.vehicleStateService.getVehicleState(vehicleNetworkId).volatile.fingerprint;
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!fingerprint) {
            this.notifier.error(source, "Aucune empreinte n'a été trouvée sur ce véhicule.");
            return;
        }
        const result = inventory.add('evidence_fingerprint', 1, {
            evidenceInfos: {
                generalInfo: `Empreinte de ${fingerprint}`,
                type: 'evidence_fingerprint',
                zone,
                support: model,
                quantity: 1,
            },
        });
        if (isErr(result)) {
            this.notifier.error(source, ADD_ERROR_MESSAGE[result.err]);
            return;
        }
        this.notifier.notify(source, 'Empreinte récupérée.');
        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
            fingerprint: null,
        });
    }

    @OnEvent(ServerEvent.VEHICLE_COLLECT_DRUG)
    public async collectDrug(source: number, vehicleNetworkId: number, zone: string, model: string) {
        const drugTypes = this.vehicleStateService.getVehicleState(vehicleNetworkId).volatile.lastDrugTrace;
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!drugTypes || drugTypes.length == 0) {
            this.notifier.error(source, "Aucune trace de drogue n'a été trouvée sur ce véhicule.");
            return;
        }
        const result = inventory.add('evidence_drug', 1, {
            evidenceInfos: {
                generalInfo: `Trace de ${drugTypes.join(', ')}`,
                type: 'evidence_drug',
                zone,
                support: model,
                quantity: 1,
            },
        });
        if (isErr(result)) {
            this.notifier.error(source, ADD_ERROR_MESSAGE[result.err]);
            return;
        }
        this.notifier.notify(source, 'Échantillon de drogue récupéré.');
        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
            lastDrugTrace: null,
        });
    }

    @OnEvent(ServerEvent.VEHICLE_HANDLING_BASE_SAVE)
    public async saveBaseHandling(source: number, model: number, handling: Record<VehicleHandlingType, number>) {
        const vehConf = await this.vehicleRepository.findByHash(model);
        vehConf.handling = handling;

        await this.prismaService.vehicle.update({
            where: {
                model: vehConf.model,
            },
            data: {
                handling: JSON.stringify(vehConf.handling),
            },
        });
    }

    @OnEvent(ServerEvent.VEHICLE_SYNC_DOOR_TRAIN)
    public async syncTrainDoors(source: number, netVeh: number, doorIndex: number, open: boolean) {
        TriggerLatentClientEvent(ClientEvent.VEHICLE_SYNC_DOOR_TRAIN, -1, 1024, netVeh, doorIndex, open);
    }
}
