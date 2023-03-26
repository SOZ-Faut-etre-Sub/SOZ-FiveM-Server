import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { PrismaService } from '@public/server/database/prisma.service';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { ProgressService } from '@public/server/player/progress.service';
import { PropsService } from '@public/server/props.service';
import { RepositoryProvider } from '@public/server/repository/repository.provider';
import { UpwChargerRepository } from '@public/server/repository/upw.station.repository';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { UpwCharger, UpwStation } from '@public/shared/fuel';
import { CommonItem, InventoryItem } from '@public/shared/item';
import { UPW_CHARGER_REFILL_VALUES } from '@public/shared/job/upw';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RpcEvent } from '@public/shared/rpc';
import { stat } from 'fs';

@Provider()
export class UpwStationProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PropsService)
    private propsService: PropsService;

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

    public async useCarCharger(source: number, item: CommonItem, inventoryItem: InventoryItem) {
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
            this.notifier.notify(source, 'Cet endroit ne semple pas adapté pour y mettre une borne.', 'error');
            return;
        }
        if (chargerToCreate.active) {
            this.notifier.notify(source, 'Il y a déjà une borne ici !', 'error');
            return;
        }
        TriggerClientEvent(ClientEvent.UPW_CREATE_CHARGER, source, chargerToCreate);
    }

    @OnEvent(ServerEvent.UPW_CREATE_CHARGER)
    public async createCharger(source: number, charger: UpwCharger) {
        const result_charger = await this.prismaService.upw_chargers.update({
            where: {
                id: charger.id,
            },
            data: {
                active: {
                    set: 1,
                },
            },
        });
        const result_station = await this.prismaService.upw_stations.update({
            where: {
                station: charger.station,
            },
            data: {
                max_stock: {
                    increment: 600,
                },
            },
        });
        if (!result_charger || !result_station) {
            this.notifier.notify(source, "Une erreur est survenue, la borne n'a pas été posée.", 'error');
        }
        this.inventoryManager.removeItemFromInventory(source, 'car_charger', 1);
        TriggerEvent('core:server:refresh-charger-props');
        await this.repositoryProvider.refresh('upwCharger');
        this.notifier.notify(source, 'Votre nouvelle borne de recharge a été posée ! Elle est magnifique.', 'success');
    }

    @Rpc(RpcEvent.UPW_GET_STATION)
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
            this.notifier.notify(source, 'La station est pleine !', 'info');
            return;
        }
        if (!this.inventoryManager.removeItemFromInventory(source, cell)) {
            this.notifier.notify(source, "Vous n'avez plus de cellule de ce type.");
            return;
        }
        const { completed } = await this.progressService.progress(
            source,
            'refill_station',
            'Vous rechargez la station...',
            10000,
            {
                dictionary: 'anim@mp_radio@garage@low',
                name: 'action_a',
                options: {
                    repeat: true,
                },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );
        if (!completed) {
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
        this.notifier.notify(source, `Charge... ~b~${newStock} / ${stationToRefill.max_stock}kWh`);
        this.onRefillStation(source, station, cell);
    }

    @Once(OnceStep.Start)
    public async onStart() {
        this.itemService.setItemUseCallback('car_charger', this.useCarCharger.bind(this));
    }
}
