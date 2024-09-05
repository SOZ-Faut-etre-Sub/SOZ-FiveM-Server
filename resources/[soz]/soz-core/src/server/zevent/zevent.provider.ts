import { Item } from '@public/shared/item';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { ItemService } from '../item/item.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class ZEventProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    private async useTShirt(source: number, item: Item) {
        const { completed } = await this.progressService.progress(source, 'wear_tshirt', '', 5000, {
            dictionary: 'anim@mp_yacht@shower@male@',
            name: 'male_shower_towel_dry_to_get_dressed',
            flags: 15,
        });

        if (!completed) {
            return;
        }

        TriggerClientEvent(ClientEvent.ZEVENT_TOGGLE_TSHIRT, source, item.name);
    }

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('zevent2022_tshirt', this.useTShirt.bind(this));
        this.itemService.setItemUseCallback('zevent2024_tshirt', this.useTShirt.bind(this));
        this.itemService.setItemUseCallback('zevent2024_tshirt_collector', this.useTShirt.bind(this));
    }
}
