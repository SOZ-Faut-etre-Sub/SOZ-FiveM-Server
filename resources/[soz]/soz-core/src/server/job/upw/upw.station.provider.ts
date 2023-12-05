import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { PrismaService } from '@public/server/database/prisma.service';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { JobService } from '@public/server/job.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerService } from '@public/server/player/player.service';
import { ProgressService } from '@public/server/player/progress.service';
import { RepositoryProvider } from '@public/server/repository/repository.provider';
import { UpwChargerRepository } from '@public/server/repository/upw.charger.repository';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { UpwCharger, UpwStation } from '@public/shared/fuel';
import { JobPermission, JobType } from '@public/shared/job';
import { UPW_CHARGER_REFILL_VALUES } from '@public/shared/job/upw';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { joaat } from '../../../shared/joaat';
import { ObjectProvider } from '../../object/object.provider';

@Provider()
export class UpwStationProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @Inject(RepositoryProvider)
    private repositoryProvider: RepositoryProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Once(OnceStep.Start)
    public async onStart() {
        this.itemService.setItemUseCallback('car_charger', this.useCarCharger.bind(this));
    }

    @OnEvent(ServerEvent.UPW_CREATE_CHARGER)
    public async createCharger(source: number, charger: UpwCharger) {
        if (!this.inventoryManager.removeItemFromInventory(source, 'car_charger', 1)) {
            this.notifier.notify(source, "Vous n'avez pas de chargeur de voiture.", 'error');

            return;
        }

        await this.prismaService.upw_chargers.update({
            where: {
                id: charger.id,
            },
            data: {
                active: {
                    set: 1,
                },
            },
        });
        await this.prismaService.upw_stations.update({
            where: {
                station: charger.station,
            },
            data: {
                max_stock: {
                    increment: 600,
                },
            },
        });

        this.objectProvider.createObject({
            id: `upw_charger_${charger.station}_${charger.id}`,
            position: charger.position,
            model: joaat('upwcarcharger'),
        });

        await this.repositoryProvider.refresh('upwCharger');

        this.notifier.notify(source, "Vous avez ~g~terminé~s~ l'installation de la borne de recharge.", 'success');
    }

    @Rpc(RpcServerEvent.UPW_GET_STATION)
    public async onGetStation(source: number, name: string): Promise<UpwStation> {
        const station = await this.prismaService.upw_stations.findFirst({
            where: {
                station: name,
            },
        });
        const position = JSON.parse(station.position) as { x: number; y: number; z: number; w: number };
        const result: UpwStation = {
            id: station.id,
            stock: station.stock,
            max_stock: station.max_stock,
            price: station.price,
            position: [position.x, position.y, position.z, position.w],
            station: station.station,
        };
        return result;
    }

    @OnEvent(ServerEvent.UPW_REFILL_STATION)
    public async onRefillStation(source: number, station: string, cell: string) {
        const stationToRefill = await this.prismaService.upw_stations.findFirst({
            where: {
                station: station,
            },
        });
        if (!stationToRefill) {
            return;
        }
        if (stationToRefill.stock > stationToRefill.max_stock - 1) {
            this.notifier.notify(source, 'La station est pleine !', 'success');
            return;
        }
        if (!this.inventoryManager.removeItemFromInventory(source, cell, 1)) {
            this.notifier.notify(source, "Une erreur s'est produite lors de la recharge.", 'error');
            return;
        }
        const newStock = Math.min(stationToRefill.stock + UPW_CHARGER_REFILL_VALUES[cell], stationToRefill.max_stock);

        await this.prismaService.upw_stations.update({
            where: {
                station: station,
            },
            data: {
                stock: {
                    set: newStock,
                },
            },
        });
        const restockPrice = UPW_CHARGER_REFILL_VALUES[cell] * 3;
        if (station) {
            await this.playerMoneyService.transfer('farm_upw', 'safe_upw', restockPrice);
        }

        this.notifier.notify(source, `Charge... ~b~${newStock}/${stationToRefill.max_stock} kWh`);

        const currentStation = await this.prismaService.upw_stations.findFirst({
            where: {
                station: station,
            },
        });

        const item = this.inventoryManager.getFirstItemInventory(source, cell);
        this.monitor.publish(
            'job_upw_station_restock',
            {
                player_source: source,
                item_id: item.name,
            },
            {
                item_label: item.label,
                station_position: currentStation.position,
                station_name: currentStation.station,
                price: restockPrice,
            }
        );
    }

    @OnEvent(ServerEvent.UPW_SET_CHARGER_PRICE)
    public async onSetChargerPrice(source: number, price: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!this.jobService.hasPermission(player, JobType.Upw, JobPermission.UpwChangePrice)) {
            this.notifier.notify(source, "Vous n'avez pas la permission de faire ça.", 'error');

            return;
        }

        await this.prismaService.upw_stations.updateMany({
            data: {
                price,
            },
        });

        this.notifier.notify(source, `Vous avez changé le prix des chargeurs à $${price}/kWh.`);
    }

    public async useCarCharger(source: number) {
        const playerPosition = GetEntityCoords(GetPlayerPed(source)) as Vector3;

        await this.upwChargerRepository.refresh();

        const chargers = await this.upwChargerRepository.get();
        let chargerToCreate: UpwCharger;

        for (const charger of Object.values(chargers)) {
            if (getDistance(playerPosition, charger.position) < 3) {
                chargerToCreate = charger;
            }
        }

        if (!chargerToCreate) {
            this.notifier.notify(source, 'Cet endroit ne semble pas adapté pour y mettre une borne.', 'error');
            return;
        }

        if (chargerToCreate.active) {
            this.notifier.notify(source, 'Il y a déjà une borne ici !', 'error');
            return;
        }

        TriggerClientEvent(ClientEvent.UPW_CREATE_CHARGER, source, chargerToCreate);
    }
}
