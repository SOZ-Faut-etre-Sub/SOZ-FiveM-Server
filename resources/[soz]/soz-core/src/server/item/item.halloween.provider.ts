import { Once } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ItemService } from '@public/server/item/item.service';
import { ProgressService } from '@public/server/player/progress.service';
import { ClientEvent } from '@public/shared/event';
import { InventoryItem, Item } from '@public/shared/item';
import { DeguisementMapping } from '@public/shared/story/halloween2022';

import { InventoryManager } from '../inventory/inventory.manager';
import { PlayerAppearanceService } from '../player/player.appearance.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class ItemHalloweenProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private item: ItemService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerAppearanceService)
    private playerAppearanceService: PlayerAppearanceService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private async useDeguisement(source: number, item: Item, inventoryItem: InventoryItem) {
        const progress = await this.progressService.progress(
            source,
            'switch_clothes',
            "Changement d'habits...",
            5000,
            {
                name: 'male_shower_towel_dry_to_get_dressed',
                dictionary: 'anim@mp_yacht@shower@male@',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                useAnimationService: true,
                disableCombat: true,
                disableMovement: true,
                canCancel: false,
            }
        );

        if (!progress.completed) {
            return;
        }

        this.inventoryManager.removeInventoryItem(source, inventoryItem);
        TriggerClientEvent(ClientEvent.HALLOWEEN_DEGUISEMENT_USE, source, item.name);
    }

    private async useHalloweenHat(source: number) {
        const progress = await this.progressService.progress(
            source,
            'switch_clothes',
            "Changement d'habits...",
            1000,
            {
                name: 'put_on_mask',
                dictionary: 'mp_masks@on_foot',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                useAnimationService: true,
                disableCombat: true,
                disableMovement: true,
                canCancel: false,
            }
        );

        if (!progress.completed) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(source);
        targetPlayer.cloth_config.Config.HideHead = false;
        this.playerAppearanceService.setClothConfig(source, targetPlayer.cloth_config, true);

        TriggerClientEvent(ClientEvent.HALLOWEEN_HAT_TOOGLE, source);
    }

    @Once()
    public onStart() {
        for (const item of Object.keys(DeguisementMapping)) {
            this.item.setItemUseCallback(item, this.useDeguisement.bind(this));
        }

        this.item.setItemUseCallback('halloween_brain_knife', this.useHalloweenHat.bind(this));
    }
}
