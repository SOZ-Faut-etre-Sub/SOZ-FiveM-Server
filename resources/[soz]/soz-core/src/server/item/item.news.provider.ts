import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { PlayerService } from '../player/player.service';
import { ItemService } from './item.service';

@Provider()
export class ItemNewsProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once()
    public onStartNewsItem() {
        this.item.setItemUseCallback('newspaper', source => {
            const player = this.playerService.getPlayer(source);

            if (!player) {
                return;
            }

            if (player.job.id !== JobType.News && player.job.id !== JobType.YouNews) {
                return;
            }

            TriggerClientEvent(ClientEvent.NEWS_NEWSPAPER_SELL, source);
        });

        this.item.setItemUseCallback('n_camera', source => {
            TriggerClientEvent(ClientEvent.ITEM_CAMERA_TOGGLE, source);
        });

        this.item.setItemUseCallback('n_mic', source => {
            TriggerClientEvent(ClientEvent.ITEM_MICROPHONE_TOGGLE, source, 'microphone');
        });

        this.item.setItemUseCallback('n_bmic', source => {
            TriggerClientEvent(ClientEvent.ITEM_MICROPHONE_TOGGLE, source, 'big_microphone');
        });
    }
}
