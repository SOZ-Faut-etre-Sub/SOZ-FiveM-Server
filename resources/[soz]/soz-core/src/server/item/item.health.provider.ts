import { Once, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { CommonItem, InventoryItem } from '../../shared/item';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { InventoryManager } from './inventory.manager';
import { ItemService } from './item.service';

@Provider()
export class ItemHealthProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    public async useFlaskPee(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        if (
            !this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            return;
        }

        const { completed } = await this.progressService.progress(source, 'pee_in_flask', '', 5000, {
            name: 'peeing_loop',
            dictionary: 'misscarsteal2peeing',
            flags: 0,
        });

        if (!completed) {
            return;
        }

        const { success, reason } = this.inventoryManager.addItemToInventory(
            source,
            'flask_pee_full',
            1,
            {
                player: source,
            },
            null
        );

        if (!success) {
            this.notifier.notify(source, 'Impossible de remplir la fiole: ' + reason, 'error');
        } else {
            this.notifier.notify(source, "Fiole rempli jusqu'à la dernière goutte", 'success');
        }
    }

    private async useAntidepressant(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        if (
            !this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            return;
        }

        // @TODO play progress animation

        this.playerService.incrementMetadata(source, 'stressLevel', -20, 0, 100);

        this.notifier.notify(
            source,
            "Voila vous êtes parfaitement détendu. Détendu. Vous êtes détendu. Oh oui je suis détendu. Qui est détendu ? C'est moi.",
            'success'
        );
    }

    @OnEvent(ServerEvent.LSMC_BLOOD_FILL_FLASK)
    public async useFlaskBlood(source: number, target: number) {
        if (!this.inventoryManager.removeItemFromInventory(source, 'flask_blood_empty', 1)) {
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'take_blood',
            'Vous faites une prise de sang...',
            5000,
            {
                task: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
            }
        );

        if (!completed) {
            return;
        }

        const { success, reason } = this.inventoryManager.addItemToInventory(
            source,
            'flask_blood_full',
            1,
            {
                player: target,
            },
            null
        );

        if (!success) {
            this.notifier.notify(source, 'Impossible de remplir la fiole: ' + reason, 'error');
        } else {
            this.notifier.notify(source, "Fiole rempli jusqu'à la dernière goutte", 'success');
        }
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('flask_pee_empty', this.useFlaskPee.bind(this));
        this.item.setItemUseCallback('antidepressant', this.useAntidepressant.bind(this));
    }
}
