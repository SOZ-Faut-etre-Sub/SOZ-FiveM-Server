import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { PlayerInventoryUpdate } from '@core/decorators/player';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { PlayerInventoryLoader } from '@core/loader/player.inventory.loader';
import { emitRpc } from '@core/rpc';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { BankMoneyType, TaxType } from '@public/shared/bank';
import { ClientEvent } from '@public/shared/event/client';
import { ServerEvent } from '@public/shared/event/server';
import {
    DEFAULT_MAX_INVENTORY_DISTANCE,
    getPositionZone,
    InventoryConfiguration,
    InventoryItem,
    InventoryPosition,
    InventoryState,
    InventoryType,
    isInventoryItemExpired,
} from '@public/shared/inventory';
import { PlayerData } from '@public/shared/player';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { ShopItem } from '@public/shared/shop/superette';
import { applyPatch, Operation } from 'fast-json-patch';

import { PlayerService } from '../player/player.service';

@Provider()
export class InventoryManager {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private _playerInventoryId: string;

    private _playerInventory: Record<number, InventoryItem> = {};

    private _playerInventoryConfiguration: InventoryConfiguration;

    private _subscribedInventoryId: string;

    private _subscribedInventory: Record<number, InventoryItem> = {};

    private _subscribedInventoryConfiguration: InventoryConfiguration;

    private _subscribedInventoryPosition: InventoryPosition | null;

    @Tick(TickInterval.EVERY_SECOND)
    public async checkInventoryPosition() {
        if (!this._subscribedInventoryPosition) {
            return;
        }

        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const maxDistance = this._subscribedInventoryPosition.maxDistance || DEFAULT_MAX_INVENTORY_DISTANCE;

        if (
            this._subscribedInventoryPosition.type === 'fixed' &&
            getDistance(playerPosition, this._subscribedInventoryPosition.position) <= maxDistance
        ) {
            return;
        }

        if (this._subscribedInventoryPosition.type === 'dynamic') {
            const entity = NetworkGetEntityFromNetworkId(this._subscribedInventoryPosition.entity);
            const entityPosition = GetEntityCoords(entity, true) as Vector3;

            if (this._subscribedInventoryPosition.dimension) {
                const heading = GetEntityHeading(entity);
                const zone = getPositionZone(
                    entityPosition,
                    heading,
                    this._subscribedInventoryPosition.dimension,
                    maxDistance
                );

                if (zone.isPointInside(playerPosition)) {
                    return;
                }
            }

            if (getDistance(playerPosition, entityPosition) <= maxDistance) {
                return;
            }
        }

        this.notifier.error("Vous êtes trop loin de l'inventaire");
        this.unsubscribeInventory();
        this.nuiDispatch.dispatch('inventory', 'CloseInventory');
    }

    @Inject(PlayerInventoryLoader)
    private playerInventoryLoader: PlayerInventoryLoader;

    @Once(OnceStep.PlayerLoaded, true)
    public async loadPlayerInventory(player: PlayerData) {
        this._playerInventoryId = 'player_' + player.citizenid;

        const [configuration, items] = await emitRpc<[InventoryConfiguration, Record<number, InventoryItem>]>(
            RpcServerEvent.INVENTORY_SELF_FETCH
        );

        this._playerInventory = items;
        this._playerInventoryConfiguration = configuration;

        this.playerInventoryLoader.trigger(this._playerInventory, this._playerInventoryConfiguration);

        this.nuiDispatch.dispatch('player', 'UpdateInventory', {
            configuration: this._playerInventoryConfiguration,
            items: this._playerInventory,
        });
    }

    @Once(OnceStep.NuiLoaded)
    public onNuiLoaded() {
        if (Object.values(this._playerInventory).length > 0) {
            this.nuiDispatch.dispatch('player', 'UpdateInventory', {
                configuration: this._playerInventoryConfiguration,
                items: this._playerInventory,
            });
        }
    }

    @OnEvent(ClientEvent.INVENTORY_OPEN)
    public subcribeInventory(
        inventoryId: string,
        type: InventoryType,
        configuration: InventoryConfiguration,
        items: Record<number, InventoryItem>,
        position: InventoryPosition,
        canForceConsume: boolean = false,
        state: InventoryState
    ) {
        this._subscribedInventoryId = inventoryId;
        this._subscribedInventory = items;
        this._subscribedInventoryConfiguration = configuration;
        this._subscribedInventoryPosition = position;

        this.nuiDispatch.closeEverything();
        this.nuiDispatch.dispatch('inventory', 'OpenInventory', {
            configuration: this._subscribedInventoryConfiguration,
            items: this._subscribedInventory,
            id: this._subscribedInventoryId,
            type: type,
            canForceConsume,
            state,
        });
    }

    @OnEvent(ClientEvent.INVENTORY_CLOSE)
    public closeInventory(inventoryId: string) {
        if (this._subscribedInventoryId === inventoryId) {
            this.nuiDispatch.dispatch('inventory', 'CloseInventory');
        }
    }

    public unsubscribeInventory() {
        if (this._subscribedInventoryId && this._subscribedInventoryId !== this._playerInventoryId) {
            TriggerServerEvent(ServerEvent.INVENTORY_UNSUBSCRIBE, this._subscribedInventoryId);
        }

        this._subscribedInventoryId = null;
        this._subscribedInventory = [];
        this._subscribedInventoryConfiguration = null;
        this._subscribedInventoryPosition = null;
    }

    @OnEvent(ClientEvent.INVENTORY_UPDATE)
    public async onPlayerInventoryUpdate(id: string, changes: Operation[], configuration: InventoryConfiguration) {
        if (id === this._subscribedInventoryId) {
            applyPatch(this._subscribedInventory, changes);
            // remove null values
            this._subscribedInventory = Object.values(this._subscribedInventory).reduce((acc, item) => {
                if (item) {
                    acc[item.slot] = item;
                }

                return acc;
            }, {});
            this._subscribedInventoryConfiguration = configuration;

            this.nuiDispatch.dispatch('inventory', 'UpdateInventory', {
                configuration: this._subscribedInventoryConfiguration,
                items: this._subscribedInventory,
                id: this._subscribedInventoryId,
            });
        }

        if (id === this._playerInventoryId) {
            applyPatch(this._playerInventory, changes);
            this._playerInventory = Object.values(this._playerInventory).reduce((acc, item) => {
                if (item) {
                    acc[item.slot] = item;
                }

                return acc;
            }, {});
            this._playerInventoryConfiguration = configuration;

            this.nuiDispatch.dispatch('player', 'UpdateInventory', {
                configuration: this._playerInventoryConfiguration,
                items: this._playerInventory,
            });

            await this.playerInventoryLoader.trigger(this._playerInventory, this._playerInventoryConfiguration);
        }
    }

    public getItems(): InventoryItem[] {
        return Object.values(this._playerInventory);
    }

    public hasEnoughItem(itemId: string, amount?: number, skipExpiredItem?: boolean): boolean {
        if (amount === 0) {
            return true;
        }
        if (!amount) {
            amount = 1;
        }
        return this.getItemCount(itemId, skipExpiredItem) >= amount;
    }

    public getItemCount(itemId: string, skipExpiredItem?: boolean): number {
        let count = 0;

        for (const item of Object.values(this._playerInventory)) {
            if (item.name === itemId) {
                if (skipExpiredItem && isInventoryItemExpired(item)) {
                    continue;
                }

                count += item.amount;
            }
        }

        return count;
    }

    public getItemAtSlot(slot: number): InventoryItem | null {
        return this.findItem(item => item.slot === slot);
    }

    public findItem(predicate: (item: InventoryItem) => boolean): InventoryItem | null {
        return Object.values(this._playerInventory).find(predicate) || null;
    }

    public openShopInventory(
        shopContent: ShopItem[],
        shopHeaderTitle: string,
        taxType?: TaxType,
        type: BankMoneyType | string = 'money',
        rpcServerEvent: RpcServerEvent = RpcServerEvent.INVENTORY_SHOP_VALIDATE_CART,
        shopId = null
    ) {
        this.nuiDispatch.closeEverything();

        this.nuiDispatch.dispatch('inventory', 'OpenShop', {
            items: shopContent,
            title: shopHeaderTitle,
            tax: taxType,
            moneyType: type,
            rpcServerEvent,
            shopId,
        });
    }

    public openInventory(type: InventoryType, inventoryIdentifier: string, inventoryPosition: Vector3 | Vector4) {
        TriggerServerEvent(ServerEvent.INVENTORY_OPEN, type, inventoryIdentifier, inventoryPosition);
    }

    public openVehicleInventory(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);
        const vehicleClass = GetVehicleClass(vehicle);
        const model = GetEntityModel(vehicle);
        const [min, max] = GetModelDimensions(model) as [Vector3, Vector3];

        TriggerServerEvent(ServerEvent.INVENTORY_OPEN_TRUNK, vehicleNetworkId, vehicleClass, { min, max });
    }

    @Exportable('hasPlayerPhone')
    public hasPlayerPhone() {
        if (IsPauseMenuActive()) {
            return false;
        }

        const hasPhone = this.hasEnoughItem('phone', 1);

        if (!hasPhone) {
            this.notifier.error("Vous n'avez pas de téléphone");

            return false;
        }

        const playerState = this.playerService.getState();

        if (playerState.isInventoryBusy) {
            this.notifier.error('Action en cours');
            return false;
        }

        const player = this.playerService.getPlayer();

        if (player.metadata.inlaststand || player.metadata.ishandcuffed) {
            this.notifier.error('Vous ne pouvez pas accéder à votre téléphone');
            return false;
        }

        return true;
    }

    @Exportable('openInventory')
    public openInventoryExport(inventoryType: InventoryType, inventoryId: string) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;
        this.openInventory(inventoryType, inventoryId, position);
    }

    @PlayerInventoryUpdate()
    public updatePlayerInventory() {
        const hasPhone = this.hasEnoughItem('phone', 1);
        const hasDongle = this.hasEnoughItem('cyber_darkweb_module', 1);

        TriggerEvent('soz-phone:client:phone:setHasItems', hasPhone, hasDongle);
    }
}
