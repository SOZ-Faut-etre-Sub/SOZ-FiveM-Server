import { add, differenceInDays } from 'date-fns';

import { DealershipConfigItem } from '../../config/dealership';
import { GarageList } from '../../config/garage';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { getDefaultVehicleCondition, getDefaultVehicleModification, Vehicle } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleDealershipProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_GET_LIST)
    public async getDealershipList(source: number, id: string): Promise<Vehicle[]> {
        const vehicles = await this.prismaService.vehicle.findMany({
            where: {
                dealershipId: id,
            },
        });

        return vehicles.map(vehicle => {
            return {
                ...vehicle,
                jobName: JSON.parse(vehicle.jobName),
            };
        });
    }

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_BUY)
    public async buyVehicle(
        source: number,
        vehicle: Vehicle,
        dealershipId: string,
        dealership: DealershipConfigItem
    ): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        if (dealership.daysBeforeNextPurchase && dealership.daysBeforeNextPurchase > 0) {
            const lastPurchase = await this.prismaService.player_purchases.findFirst({
                where: {
                    citizenid: player.citizenid,
                    shop_id: dealershipId,
                },
                orderBy: {
                    date: 'desc',
                },
            });

            if (lastPurchase) {
                const lastPurchaseDate = new Date(lastPurchase.date * 1000);
                const nextPurchaseDate = add(lastPurchaseDate, {
                    days: dealership.daysBeforeNextPurchase,
                });

                if (nextPurchaseDate.getTime() > Date.now()) {
                    const days = differenceInDays(nextPurchaseDate, new Date());
                    this.notifier.notify(source, `Tu dois attendre ${days} jour(s) avant ton prochain achat.`, 'error');

                    return false;
                }
            }
        }

        if (!this.playerMoneyService.remove(source, vehicle.price)) {
            this.notifier.notify(source, `Tu n'as pas assez d'argent.`, 'error');

            return false;
        }

        const plate = await this.vehicleService.generatePlate();
        const nowInSeconds = Math.round(Date.now() / 1000);

        await this.prismaService.playerVehicle.create({
            data: {
                license: player.license,
                citizenid: player.citizenid,
                vehicle: vehicle.model,
                hash: vehicle.hash.toString(),
                mods: JSON.stringify(getDefaultVehicleModification()),
                condition: JSON.stringify(getDefaultVehicleCondition()),
                garage: dealership.garageName,
                plate,
                category: vehicle.category,
                state: PlayerVehicleState.InGarage,
                life_counter: 3,
                boughttime: nowInSeconds,
                parkingtime: nowInSeconds,
            },
        });

        await this.prismaService.player_purchases.create({
            data: {
                citizenid: player.citizenid,
                shop_type: 'dealership',
                shop_id: dealershipId,
                item_id: vehicle.model,
                amount: vehicle.price,
                date: nowInSeconds,
            },
        });

        await this.prismaService.vehicle.update({
            where: {
                model: vehicle.model,
            },
            data: {
                stock: {
                    decrement: 1,
                },
            },
        });

        const garageConfig = GarageList[dealership.garageName];

        this.notifier.notify(
            source,
            `Merci pour votre achat! Le véhicule a été envoyé au garage '${garageConfig.name}'`,
            'success'
        );

        return true;
    }
}
