import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { doLooting, Loot } from '../../../shared/loot';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class LsmcHalloweenProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    private loots: Loot[] = [
        { type: 'item', value: 'batrachian_eye', chance: 50 },
        { type: 'item', value: 'zombie_hand', chance: 50 },
    ];

    @OnEvent(ServerEvent.LSMC_HALLOWEEN_LOOT_PLAYER)
    async onLoot(source: number, targetPlayerSource: number) {
        const targetPlayer = this.playerService.getPlayer(targetPlayerSource);
        if (!targetPlayer) {
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'analyze',
            'Récupération du contenu des poches',
            5000,
            {
                name: 'base',
                dictionary: 'amb@prop_human_bum_bin@base',
                flags: 1,
            }
        );

        if (!completed) {
            return;
        }

        if (Player(targetPlayerSource).state.get('isLooted') === true) {
            return;
        }

        Player(targetPlayerSource).state.set('isLooted', true, true);

        this.inventoryManager.addItemToInventory(source, doLooting(this.loots).value.toString(), 1);

        this.notifier.notify(source, `Vous avez récupéré le contenu des poches de ${targetPlayer.name} !`, 'success');
    }
}
