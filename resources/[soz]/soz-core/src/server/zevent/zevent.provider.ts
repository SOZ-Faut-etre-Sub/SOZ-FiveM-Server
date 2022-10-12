import { Once, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryManager } from '../item/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class ZEventProvider {
    private readonly ITEM_ID = 'zevent2022_popcorn';
    private readonly AMOUNT_TO_GIVE = 1;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private async useTShirt(source: number) {
        const { completed } = await this.progressService.progress(source, 'wear_tshirt', '', 5000, {
            dictionary: 'anim@mp_yacht@shower@male@',
            name: 'male_shower_towel_dry_to_get_dressed',
            flags: 15,
        });

        if (!completed) {
            return;
        }

        TriggerClientEvent(ClientEvent.ZEVENT_TOGGLE_TSHIRT, source);
    }

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('zevent2022_tshirt', this.useTShirt.bind(this));
    }
}
