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
export class VehicleFuelProvider {
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

    private currentFilling = new Set<number>();

    @OnEvent(ServerEvent.VEHICLE_FUEL_START)
    public async startFuel(source: number, vehicleNetworkId: number, stationId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (this.currentFilling.has(vehicleNetworkId)) {
            this.notifier.notify(source, 'Le véhicule est déjà en train de se faire remplir.', 'error');

            return;
        }

        this.currentFilling.add(vehicleNetworkId);
        try {
            const vehicleState = this.vehicleStateService.getVehicleState(vehicleNetworkId);
            const fuelToFill = Math.floor(100 - vehicleState.condition.fuelLevel);

            const [reservedFuel, station, maxFuelMoney] = await this.lockService.lock(
                `fuel_station_${stationId}`,
                async () => {
                    const station = await this.prismaService.fuel_storage.findUnique({
                        where: {
                            id: stationId,
                        },
                    });

                    const maxFuelForMoney =
                        station.price > 0 ? Math.floor(player.money.money / station.price) : fuelToFill;
                    const reservedFuel = Math.min(fuelToFill, station.stock, maxFuelForMoney);
                    let reservedFuelTx = reservedFuel;

                    if (station.station === 'Cayo_heli' || station.station === 'Cayo') {
                        reservedFuelTx = 0;
                    }

                    await this.prismaService.fuel_storage.update({
                        where: {
                            id: station.id,
                        },
                        data: {
                            stock: {
                                decrement: reservedFuelTx,
                            },
                        },
                    });

                    return [reservedFuel, station, maxFuelForMoney];
                },
                1000
            );

            if (maxFuelMoney <= 0) {
                this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');
                this.currentFilling.delete(vehicleNetworkId);
                TriggerClientEvent(ClientEvent.VEHICLE_FUEL_STOP, source);

                return;
            }

            if (reservedFuel <= 0) {
                this.notifier.notify(source, 'La station vient de se vider.', 'error');
                this.currentFilling.delete(vehicleNetworkId);
                TriggerClientEvent(ClientEvent.VEHICLE_FUEL_STOP, source);

                return;
            }

            const duration = Math.max(reservedFuel * 600, 5000);

            TriggerClientEvent(ClientEvent.VEHICLE_FUEL_START, source, duration, reservedFuel, station.price);

            const { progress } = await this.progressService.progress(
                source,
                'filling_vehicle',
                'Remplissage en cours...',
                duration,
                {
                    name: 'gar_ig_5_filling_can',
                    dictionary: 'timetable@gardener@filling_can',
                    options: {
                        enablePlayerControl: false,
                        repeat: true,
                        onlyUpperBody: true,
                    },
                },
                {
                    useAnimationService: true,
                }
            );

            const totalFilled = Math.min(reservedFuel, Math.ceil(progress * reservedFuel));
            const cost = Math.floor(totalFilled * station.price);
            let leftOver = reservedFuel - totalFilled;

            if (station.price > 0 && !this.playerMoneyService.remove(source, cost)) {
                this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');
                leftOver = reservedFuel;
            } else {
                this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
                    fuelLevel: vehicleState.condition.fuelLevel + totalFilled,
                });

                this.notifier.notify(source, `Vous avez payé $${cost} pour ${totalFilled}L de carburant.`, 'success');
            }

            TriggerClientEvent(ClientEvent.VEHICLE_FUEL_STOP, source);

            if (leftOver > 0) {
                await this.prismaService.fuel_storage.update({
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
        } finally {
            this.currentFilling.delete(vehicleNetworkId);
        }
    }
}
