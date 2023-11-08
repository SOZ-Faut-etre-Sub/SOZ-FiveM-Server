import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Monitor } from '@public/server/monitor/monitor';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';
import { VehicleCategory } from '@public/shared/vehicle/vehicle';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { BankService } from '../bank/bank.service';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { ServerStateService } from '../server.state.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehiclePitStopProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(Monitor)
    private monitor: Monitor;

    private prices = new Map<string, number>();

    @Once(OnceStep.DatabaseConnected)
    public async init() {
        const rows = await this.prismaService.pitstop_price.findMany();
        for (const row of rows) {
            this.prices.set(row.category, row.price);
        }
    }

    private async getPrice(vehicleNetworkId: number) {
        const vehicle = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const vehicleModel = GetEntityModel(vehicle);
        const vehicleDB = await this.vehicleRepository.findByHash(vehicleModel);

        return this.getCategoryPrice(vehicleDB.category);
    }

    private getCategoryPrice(category: string) {
        return this.prices.has(category) ? this.prices.get(category) : 1;
    }

    @Rpc(RpcServerEvent.VEHICLE_PITSTOP_DATA)
    public async getPitStopData(source: number, vehicleNetworkId: number): Promise<[boolean, number]> {
        const players = this.serverStateService.getPlayers();
        if (players.find(player => player.job.id == JobType.Bennys && player.job.onduty)) {
            return [true, 0];
        }

        const price = await this.getPrice(vehicleNetworkId);

        return [false, price];
    }

    private getPrices(): Record<string, number> {
        const prices: Record<string, number> = {};
        for (const category of Object.keys(VehicleCategory)) {
            prices[category] = this.getCategoryPrice(category);
        }

        return prices;
    }

    @Rpc(RpcServerEvent.VEHICLE_PITSTOP_PRICES)
    public async getPitStopPrices(): Promise<Record<string, number>> {
        return this.getPrices();
    }

    @Rpc(RpcServerEvent.VEHICLE_PITSTOP_PRICES_UPDATE)
    public async setPitStopPrice(source: number, category: string, price: number): Promise<Record<string, number>> {
        await this.prismaService.pitstop_price.upsert({
            where: {
                category: category,
            },
            update: {
                price: price,
            },
            create: {
                price: price,
                category: category,
            },
        });
        this.prices.set(category, price);

        this.notifier.notify(
            source,
            `Le prix du Pit Stop pour les ${VehicleCategory[category]} est maintenant de ~g~${price}~s~`
        );

        this.monitor.publish(
            'vehicle_pitstop_price_update',
            {
                player_source: source,
            },
            {
                price: price,
                category: category,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );

        return this.getPrices();
    }

    @OnEvent(ServerEvent.VEHICLE_PITSTOP)
    public async onPitStop(source: number, vehicleNetworkId: number) {
        const price = await this.getPrice(vehicleNetworkId);

        if (!this.playerMoneyService.remove(source, price)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
            return;
        }

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
            engineHealth: 1000,
            bodyHealth: 1000,
            doorStatus: {},
            windowStatus: {},
            tankHealth: 1000,
            tireTemporaryRepairDistance: {},
            tireHealth: {},
            tireBurstCompletely: {},
            tireBurstState: {},
        });

        this.bankService.addMoney('safe_' + JobType.Bennys, Math.round(price / 2));

        this.notifier.notify(source, 'Le véhicule a été réparé', 'success');

        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        this.monitor.publish(
            'vehicle_pitstop',
            {
                player_source: source,
                vehicle_plate: state.volatile.plate,
            },
            {
                price: price,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }
}
