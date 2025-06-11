import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { PlayerProvider } from '../player/player.provider';
import { ItemService } from './item.service';

@Provider()
export class ItemPanelProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(PlayerProvider)
    private playerProvider: PlayerProvider;

    private async useZPad(source: number, item: Item, inventoryItem: InventoryItem): Promise<void> {
        const token = await this.playerProvider.getJwtToken(source);
        if (token === null) {
            return;
        }

        let endpointUrl = `${GetConvar('soz_public_endpoint', 'https://soz.zerator.com')}/token-callback?token=${token}`;

        if (inventoryItem.metadata?.url) {
            endpointUrl += `&redirect=${inventoryItem.metadata?.url}`;
        }

        TriggerClientEvent(ClientEvent.NUI_SHOW_PANEL, source, endpointUrl);
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('zpad', this.useZPad.bind(this));
    }
}
