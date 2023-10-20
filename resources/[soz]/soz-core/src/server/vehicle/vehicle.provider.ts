import { GarageList } from '@public/config/garage';
import { VehicleClass } from '@public/shared/vehicle/vehicle';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { VehicleService } from './vehicle.service';

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

    @OnEvent(ServerEvent.ADMIN_ADD_VEHICLE)
    public async addVehicle(source: number, model: string, name: string, vehClass: VehicleClass, mods: any[]) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const garage = vehClass == VehicleClass.Boats ? 'docks_boat' : 'airport_public';

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

    @OnEvent(ServerEvent.VEHICLE_DEBUG_OWNER)
    public askDetachVehicle(source: number, vehNetworkId: number) {
        const veh = NetworkGetEntityFromNetworkId(vehNetworkId);

        if (!veh) {
            return;
        }

        const owner = NetworkGetEntityOwner(veh);

        if (owner > 0) {
            TriggerClientEvent(ClientEvent.VEHICLE_DEBUG_OWNER, owner, vehNetworkId);
        }
    }
}
