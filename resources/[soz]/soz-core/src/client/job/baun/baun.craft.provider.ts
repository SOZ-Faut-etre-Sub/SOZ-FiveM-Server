import { CraftService } from '@public/client/craft/craft.service';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { ProgressService } from '@public/client/progress.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { PositiveNumberValidator } from '@public/shared/nui/input';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { baunCraftZones } from '../../../shared/job/baun';

@Provider()
export class BaunCraftProvider {
    @Inject(CraftService)
    private craftService: CraftService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.PlayerLoaded)
    public setupBaunCraftZone() {
        this.craftService.createBtargetZoneCraft(baunCraftZones, 'c:/baun/craft', 'Confectionner', JobType.Baun);
    }

    @OnEvent(ClientEvent.BAUN_ICE_CUBE, false)
    public async onIceCube() {
        const max = this.inventoryManager.getItemCount('water_bottle', true);

        const val = await this.inputService.askInput(
            {
                title: 'Quantité de bouteilles à transformer',
                defaultValue: max.toString(),
                maxCharacters: 5,
            },
            PositiveNumberValidator
        );

        if (!val) {
            return;
        }

        if (val > max) {
            const secItem = this.itemService.getItem('water_bottle');
            this.notifier.notify(`Vous n'avez pas assez de ${secItem.label}.`, 'error');
            return;
        }

        const { completed } = await this.progressService.progress(
            'baun_ice',
            `Création de glacons`,
            2000,
            {
                dictionary: 'mp_fm_intro_cut',
                name: 'fixing_a_ped',
                options: {
                    repeat: true,
                },
            },
            {}
        );

        if (!completed) {
            return;
        }

        TriggerServerEvent(ServerEvent.BAUN_ICE_CUBE, val);
    }
}
