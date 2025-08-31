import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';

import { Once, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryFactory } from '../inventory/inventory.factory';
import { PlayerProvider } from '../player/player.provider';
import { ItemService } from './item.service';

@Provider()
export class ItemPanelProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(PlayerProvider)
    private playerProvider: PlayerProvider;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    private readonly BlacklistedUrls = ['/allowlist', '/allowlist/unregister'];

    private async useZPad(source: number, item: Item, inventoryItem: InventoryItem): Promise<void> {
        const token = await this.playerProvider.getJwtToken(source);
        if (token === null) {
            return;
        }

        let endpointUrl = `${GetConvar('soz_public_endpoint', 'https://soz.zerator.com')}/token-callback?token=${token}`;

        if (inventoryItem.metadata?.url && !this.BlacklistedUrls.includes(inventoryItem.metadata.url)) {
            endpointUrl += `&redirect=${inventoryItem.metadata?.url}`;
        }

        TriggerClientEvent(ClientEvent.NUI_SHOW_PANEL, source, endpointUrl, inventoryItem.slot);
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('zpad', this.useZPad.bind(this));
    }

    @OnEvent(ServerEvent.PANEL_UPDATE_ITEM_URL)
    private async updateZPadUrl(source: number, slot: number, url: string) {
        const endpointUrl = new URL(GetConvar('soz_public_endpoint', 'https://soz.zerator.com'));
        const targetUrl = new URL(url);

        if (targetUrl.hostname !== endpointUrl.hostname || targetUrl.pathname.startsWith('/zkea')) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) {
            return;
        }

        inventory.updateMetadataAtSlot(slot, {
            url: targetUrl.pathname,
        });
    }
}
