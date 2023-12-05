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

    private async useZPad(source: number): Promise<void> {
        const token = await this.playerProvider.getJwtToken(source);

        if (null === token) {
            return;
        }

        TriggerClientEvent(
            ClientEvent.NUI_SHOW_PANEL,
            source,
            `${GetConvar('soz_public_endpoint', 'https://soz.zerator.com')}/token-callback?token=${token}`
        );
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('zpad', this.useZPad.bind(this));
    }
}
