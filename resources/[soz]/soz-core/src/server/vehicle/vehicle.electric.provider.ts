import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';
import { LockService } from '../lock.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleElectricProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(LockService)
    private lockService: LockService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    private currentCharging = new Set<number>();

    @OnEvent(ServerEvent.VEHICLE_CHARGE_START)
    public async startCharge(source: number, vehicleNetworkId: number, stationId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const energyToFill = Math.floor((100 - vehicleState.condition.fuelLevel) * 0.6); // 100L <=> 60kWh

        if (this.currentCharging.has(vehicleNetworkId)) {
            this.notifier.notify(source, 'Le véhicule est déjà en train de charger.', 'error');

            return;
        }

        this.currentCharging.add(vehicleNetworkId);

        const [reservedEnergy, station, maxEnergyForMoney] = await this.lockService.lock(
            `upw_station_${stationId}`,
            async () => {
                const station = await this.prismaService.upw_stations.findUnique({
                    where: {
                        id: stationId,
                    },
                });

                const maxEnergyForMoney =
                    station.price > 0 ? Math.floor(player.money.money / station.price) : energyToFill;
                const reservedEnergy = Math.min(energyToFill, station.stock, maxEnergyForMoney);

                await this.prismaService.upw_stations.update({
                    where: {
                        id: station.id,
                    },
                    data: {
                        stock: {
                            decrement: reservedEnergy,
                        },
                    },
                });

                return [reservedEnergy, station, maxEnergyForMoney];
            },
            1000
        );

        if (maxEnergyForMoney <= 0) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');
            this.currentCharging.delete(vehicleNetworkId);
            TriggerClientEvent(ClientEvent.VEHICLE_CHARGE_STOP, source);

            return;
        }

        if (reservedEnergy <= 0) {
            this.notifier.notify(source, 'La station vient de se vider.', 'error');
            this.currentCharging.delete(vehicleNetworkId);
            TriggerClientEvent(ClientEvent.VEHICLE_CHARGE_STOP, source);

            return;
        }

        const duration = Math.max(reservedEnergy * 3000, 8000); // Charging is 3x slower than fueling (and there is a factor 0.6 between fuel and energy)

        TriggerClientEvent(ClientEvent.VEHICLE_CHARGE_START, source, duration, reservedEnergy, station.price);

        const { progress } = await this.progressService.progress(source, 'charging_vehicle', '', duration, {
            name: 'gar_ig_5_filling_can',
            dictionary: 'timetable@gardener@filling_can',
            options: {
                enablePlayerControl: false,
                repeat: true,
                onlyUpperBody: true,
            },
        });

        const totalFilled = Math.min(reservedEnergy, Math.floor(progress * reservedEnergy));
        const cost = Math.floor(totalFilled * station.price);
        let leftOver = reservedEnergy - totalFilled;

        if (station.price > 0 && !this.playerMoneyService.remove(source, cost)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');
            leftOver = reservedEnergy;
        } else {
            this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
                fuelLevel: vehicleState.condition.fuelLevel + Math.ceil(totalFilled / 0.6),
            });

            this.notifier.notify(source, `Vous avez payé $${cost} pour ${totalFilled}kWh d'éléctricité.`, 'success');
        }

        TriggerClientEvent(ClientEvent.VEHICLE_CHARGE_STOP, source);
        this.currentCharging.delete(vehicleNetworkId);

        if (leftOver > 0) {
            await this.prismaService.upw_stations.update({
                where: {
                    id: stationId,
                },
                data: {
                    stock: {
                        increment: leftOver,
                    },
                },
            });
        }
    }
}
