import { Command } from '@public/core/decorators/command';
import { On, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ServerEvent } from '@public/shared/event/server';
import { RpcServerEvent } from '@public/shared/rpc';
import axios from 'axios';

import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { ServerStateService } from '../server.state.service';

const BlacklistedPeds = [
    GetHashKey('s_m_y_ranger_01'),
    GetHashKey('s_m_y_sheriff_01'),
    GetHashKey('s_m_y_cop_01'),
    GetHashKey('s_f_y_sheriff_01'),
    GetHashKey('s_f_y_cop_01'),
    GetHashKey('s_m_y_hwaycop_01'),
];

@Provider()
export class UtilsProvider {
    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Monitor)
    private monitor: Monitor;

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        const entityModel = GetEntityModel(handle);

        if (GetEntityType(handle) == 1 && BlacklistedPeds.includes(entityModel)) {
            CancelEvent();
        }
    }

    @OnEvent(ServerEvent.DISPENSER_BUY)
    public onDispenserBuy(source: number, price: number, item: string) {
        if (!this.inventoryManager.canCarryItem(source, item, 1)) {
            this.notifier.notify(source, `Vous n'avez pas assez de place dans votre inventaire`, 'error');
            return;
        }

        if (this.playerMoneyService.remove(source, price, 'money')) {
            this.inventoryManager.addItemToInventory(source, item);
            const itemFull = this.itemService.getItem(item);
            this.notifier.notify(source, `Vous avez ~g~acheté~s~ un ${itemFull.label}.`, 'success');
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

        this.monitor.publish(
            'zone_intrusion',
            { player_source: source, zone: zone },
            { position: GetEntityCoords(GetPlayerPed(source)) }
        );
    }
}
