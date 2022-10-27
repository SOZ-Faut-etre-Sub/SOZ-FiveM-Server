import { Once, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { CommonItem, InventoryItem } from '../../shared/item';
import { Notifier } from '../notifier';
import { PlayerDiseaseProvider } from '../player/player.disease.provider';
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

    @Inject(PlayerDiseaseProvider)
    private diseaseService: PlayerDiseaseProvider;

    private usedAntiDepressant = new Set<string>();

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
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

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

        if (this.usedAntiDepressant.has(player.citizenid)) {
            this.notifier.notify(source, 'Vous avez déjà pris un antidépresseur.', 'error');

            return;
        }

        this.usedAntiDepressant.add(player.citizenid);
        this.playerService.incrementMetadata(source, 'stress_level', -40, 0, 100);

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

    public useAntiacide(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

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

        if (player.metadata.disease === 'dyspepsie') {
            this.diseaseService.setPlayerDisease(source, false);
            this.notifier.notify(source, 'Vous vous sentez moins balonner.', 'success');
        } else {
            this.notifier.notify(
                source,
                "Vous vous demandez encore pourquoi vous venez d'avaler ce médicament ?",
                'error'
            );
        }
    }

    public useHorrificLollipop(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

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

        TriggerClientEvent(ClientEvent.LSMC_HALLOWEEN_HORRIFIC_LOLLIPOP, source);
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('flask_pee_empty', this.useFlaskPee.bind(this));
        this.item.setItemUseCallback('antidepressant', this.useAntidepressant.bind(this));
        this.item.setItemUseCallback('antiacide', this.useAntiacide.bind(this));
        this.item.setItemUseCallback('horrific_lollipop', this.useHorrificLollipop.bind(this));
    }
}
