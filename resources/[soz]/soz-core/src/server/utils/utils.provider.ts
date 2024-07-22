import { Command } from '@public/core/decorators/command';
import { On, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ServerEvent } from '@public/shared/event/server';
import { RpcServerEvent } from '@public/shared/rpc';
import axios from 'axios';

import { TaxType } from '../../shared/bank';
import { ADD_ERROR_MESSAGE } from '../../shared/inventory';
import { Vector3 } from '../../shared/polyzone/vector';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { ServerStateService } from '../server.state.service';

@Provider()
export class UtilsProvider {
    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.DISPENSER_BUY)
    public async onDispenserBuy(source: number, price: number, item: string, quantity: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.canCarryItem(item, quantity)) {
            this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
            return;
        }

        if (await this.playerMoneyService.buy(source, price * quantity, TaxType.FOOD)) {
            inventory.add(item, quantity);

            const itemFull = this.itemService.getItem(item);
            this.notifier.notify(source, `Vous avez acheté ~g~${quantity}~s~ ~b~${itemFull.label}~s~.`, 'success');
        } else {
            this.notifier.notify(source, `Vous n'avez pas assez d'argent.`, 'error');
        }
    }

    @On('chatMessage')
    public onchatMessage(source: number, playerName, message: string) {
        if (!message.startsWith('/')) {
            CancelEvent();
        }
    }

    @Rpc(RpcServerEvent.CURRENT_PLAYERS)
    public onCurrentPlayers() {
        return [this.serverStateService.getPlayers().length, 350];
    }

    @Command('id')
    public onId(source: number) {
        this.notifier.notify(source, 'ID: ' + source);
    }

    @On('core:server:zoneIntrusion')
    public onZoneIntrusion(source: number, zone: string) {
        const player = this.playerService.getPlayer(source);
        const endpoint = GetConvar('discord_webhook_zone', '');

        if (endpoint) {
            axios.post(
                endpoint,
                {
                    username: 'SOZ reporter',
                    embeds: {
                        ['title']: '**Intrusion dans une zone interdite**',
                        ['color']: 16586776,
                        ['fields']: [
                            {
                                ['name']: 'Joueur',
                                ['value']: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                                ['inline']: true,
                            },
                            { ['name']: 'Zone', ['value']: zone, ['inline']: true },
                        ],
                    },
                },
                {
                    auth: {
                        username: GetConvar('soz_api_username', 'admin'),
                        password: GetConvar('soz_api_password', 'admin'),
                    },
                    validateStatus: () => true,
                }
            );
        }

        this.monitor.traceEvent('zone_intrusion', {
            player_source: source,
            zone_id: zone,
            position: GetEntityCoords(GetPlayerPed(source)) as Vector3,
        });
    }
}
