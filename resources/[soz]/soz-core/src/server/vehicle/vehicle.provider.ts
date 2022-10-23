import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
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
    public async addVehicle(source: number, model: string, name: string, mods: any[]) {
        const player = this.playerService.getPlayer(source);
        await this.prismaService.playerVehicle.create({
            data: {
                license: player.license,
                citizenid: player.citizenid,
                vehicle: name,
                hash: GetHashKey(model).toString(),
                mods: JSON.stringify(mods),
                plate: await this.vehicleService.generatePlate(),
                garage: 'airportpublic',
                state: 1,
                boughttime: Math.floor(new Date().getTime() / 1000),
                parkingtime: Math.floor(new Date().getTime() / 1000),
            },
        });

        this.notifier.notify(source, 'Une version de ce véhicule ~g~a été ajouté~s~ au parking public');
    }
}
