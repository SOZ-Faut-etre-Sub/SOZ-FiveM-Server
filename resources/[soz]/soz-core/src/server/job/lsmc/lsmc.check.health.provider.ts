import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { healthLevelToLabel, injuriesLevelToLabel, stressLevelToLabel } from '@public/shared/health';
import { PlayerHealthBook } from '@public/shared/player';

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

    private async doAnalyze(source: number, label: string, item_id: string) {
        const inventoryItem = this.inventoryManager.getFirstItemInventory(source, item_id);

        if (!inventoryItem) {
            return null;
        }

        const { completed } = await this.progressService.progress(source, 'analyze', label, 5000, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return null;
        }

        const targetPlayerSource = inventoryItem.metadata?.player;

        if (!targetPlayerSource) {
            return null;
        }

        const targetPlayer = this.playerService.getPlayer(targetPlayerSource);

        if (!targetPlayer) {
            return null;
        }

        this.inventoryManager.removeInventoryItem(source, inventoryItem);

        return targetPlayer;
    }

    @OnEvent(ServerEvent.LSMC_SET_HEALTH_BOOK)
    async setHealthBook(source: number, target: number, field: keyof PlayerHealthBook, value: number) {
        this.playerService.setPlayerMetaDatas(target, { [field]: value, health_book_update_date: Date.now() });

        this.notifier.notify(source, `Carte de santé mise à jour.`, 'success');
    }

    @OnEvent(ServerEvent.LSMC_BLOOD_ANALYZE)
    async onBloodAnalyze(source: number) {
        const targetPlayer = await this.doAnalyze(source, 'Analyse de sang', 'flask_blood_full');

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
        const targetPlayer = this.playerService.getPlayer(target);

        if (!targetPlayer) {
            return;
        }

        const healthStateLabel = healthLevelToLabel(targetPlayer.metadata.health_level, 0, 100);
        const stressLevelLabel = stressLevelToLabel(targetPlayer.metadata.stress_level);
        const maxStaminaLevelLabel = healthLevelToLabel(targetPlayer.metadata.max_stamina, 60, 150);
        const strengthLevelLabel = healthLevelToLabel(targetPlayer.metadata.strength, 60, 150);
        const injuriesLevelLabel = injuriesLevelToLabel(targetPlayer);

        this.notifier.notify(
            source,
            `<strong>État de santé de ${targetPlayer.charinfo.firstname} ${targetPlayer.charinfo.lastname}</strong>~n~` +
                `<span style="text-decoration: underline;">Santé :</span> ${healthStateLabel} (${targetPlayer.metadata.health_level})~n~` +
                `<span style="text-decoration: underline;">Endurance :</span> ${maxStaminaLevelLabel} (${targetPlayer.metadata.max_stamina})~n~` +
                `<span style="text-decoration: underline;">Force :</span> ${strengthLevelLabel} (${targetPlayer.metadata.strength})~n~` +
                `<span style="text-decoration: underline;">Stress :</span> ${stressLevelLabel} (${targetPlayer.metadata.stress_level})~n~` +
                `<span style="text-decoration: underline;">Blessures :</span> ${injuriesLevelLabel}~n~`,
            'success'
        );
    }

    @OnEvent(ServerEvent.LSMC_PEE_ANALYZE)
    async onPeeAnalyze(source: number) {
        const targetPlayer = await this.doAnalyze(source, 'Analyse urinaire', 'flask_pee_full');

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
