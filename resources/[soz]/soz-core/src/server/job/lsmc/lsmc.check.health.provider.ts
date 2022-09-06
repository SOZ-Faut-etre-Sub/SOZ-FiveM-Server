import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { healthLevelToLabel } from '../../../shared/health';
import { PlayerHealthBook } from '../../../shared/player';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class LSMCCheckHealthProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    async doAnalyze(source: number, label: string, item_id: string) {
        const inventoryItem = this.inventoryManager.getFirstItemInventory(source, item_id);

        if (!inventoryItem) {
            return {};
        }

        const { completed } = await this.progressService.progress(source, 'analyze', label, 5000, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return {};
        }

        const targetPlayerSource = inventoryItem.metadata?.player;

        if (!targetPlayerSource) {
            return {};
        }

        const targetPlayer = this.playerService.getPlayer(targetPlayerSource);

        if (!targetPlayer) {
            return {};
        }

        this.inventoryManager.removeItemFromInventory(source, item_id, 1, inventoryItem.metadata, inventoryItem.slot);

        return { targetPlayer, inventoryItem };
    }

    @OnEvent(ServerEvent.LSMC_SET_HEALTH_BOOK)
    async setHealthBook(source: number, target: number, field: keyof PlayerHealthBook, value: number) {
        this.playerService.setPlayerMetadata(target, field, value);

        this.notifier.notify(source, `Carte de santé mis à jour.`, 'success');
    }

    @OnEvent(ServerEvent.LSMC_BLOOD_ANALYZE)
    async onBloodAnalyze(source: number) {
        const { targetPlayer } = await this.doAnalyze(source, 'Analyse de sang', 'flask_blood_full');

        if (!targetPlayer) {
            return;
        }

        this.notifier.notify(
            source,
            `Analyse complète, glucides: ${targetPlayer.metadata.sugar}, protéines: ${targetPlayer.metadata.protein}.`,
            'success'
        );
    }

    @OnEvent(ServerEvent.LSMC_HEALTH_CHECK)
    async onHealthCheck(source: number, target: number) {
        const { completed } = await this.progressService.progress(
            source,
            'lsmc_health_check',
            "Vous étudiez l'état de santé du patient...",
            5000,
            {
                task: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
            }
        );

        if (!completed) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(target);

        if (!targetPlayer) {
            return;
        }

        const healthStateLabel = healthLevelToLabel(targetPlayer.metadata.health_level, 0, 100);
        const stressLevelLabel = healthLevelToLabel(targetPlayer.metadata.stress_level, 0, 100);
        const maxStaminaLevelLabel = healthLevelToLabel(targetPlayer.metadata.max_stamina, 0, 100);
        const strengthLevelLabel = healthLevelToLabel(targetPlayer.metadata.strength, 0, 100);

        this.notifier.notify(
            source,
            `Etat de santé ${healthStateLabel} (${targetPlayer.metadata.health_level}).`,
            'success'
        );
        this.notifier.notify(
            source,
            `Etat de force ${strengthLevelLabel} (${targetPlayer.metadata.strength}).`,
            'success'
        );
        this.notifier.notify(
            source,
            `Etat d'endurance ${maxStaminaLevelLabel} (${targetPlayer.metadata.max_stamina}).`,
            'success'
        );
        this.notifier.notify(
            source,
            `Etat de stress ${stressLevelLabel} (${targetPlayer.metadata.stress_level}).`,
            'success'
        );
    }

    @OnEvent(ServerEvent.LSMC_PEE_ANALYZE)
    async onPeeAnalyze(source: number) {
        const { targetPlayer } = await this.doAnalyze(source, 'Analyse urinaire', 'flask_pee_full');

        if (!targetPlayer) {
            return;
        }

        this.notifier.notify(
            source,
            `Analyse complète, fibre: ${targetPlayer.metadata.fiber}, lipides: ${targetPlayer.metadata.lipid}.`,
            'success'
        );
    }
}
