import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { getRandomInt } from '../../../shared/random';
import { BankService } from '../../bank/bank.service';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class NewsFarmProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.NEWS_NEWSPAPER_FARM)
    public async onNewsFarm(source: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'news:farm',
            'Récupération de journaux',
            10000,
            {
                dictionary: 'anim@narcotics@trash',
                name: 'drop_front',
                options: {
                    onlyUpperBody: true,
                },
            },
            {
                disableMouse: false,
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
            }
        );

        if (!completed) {
            return;
        }

        const amount = getRandomInt(10, 50);
        const { success, reason } = this.inventoryManager.addItemToInventory(source, 'newspaper', amount);

        if (!success) {
            this.notifier.error(source, 'Impossible de récupérer les journaux : ' + reason);

            return;
        }

        this.notifier.notify(source, `Vous avez récupéré ~g~${amount} journaux.`);

        this.monitor.publish(
            'job_news_print_newspaper',
            {
                player_source: source,
            },
            {
                quantity: amount,
                position: GetEntityCoords(GetPlayerPed(source)),
            }
        );
    }

    @OnEvent(ServerEvent.NEWS_NEWSPAPER_SOLD)
    public async onNewspaperSold(source: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'news:farm',
            'Vente de journaux',
            2000,
            {
                dictionary: 'anim@narcotics@trash',
                name: 'drop_front',
                options: {
                    onlyUpperBody: true,
                },
            },
            {
                disableMouse: false,
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
            }
        );

        if (!completed) {
            return;
        }

        const maxAmountInventory = this.inventoryManager.getItemCount(source, 'newspaper');

        if (maxAmountInventory === 0) {
            this.notifier.error(source, "Vous ~r~n'avez plus~s~ de journaux");

            return;
        }

        const amount = getRandomInt(Math.max(2, maxAmountInventory), Math.min(maxAmountInventory, 10));

        if (!this.inventoryManager.removeItemFromInventory(source, 'newspaper', amount)) {
            this.notifier.error(source, 'Impossible de vendre les journaux');

            return;
        }

        if (player.job.id === JobType.News) {
            await this.bankService.transferBankMoney('farm_news', 'safe_news', amount * 50);
        }

        if (player.job.id === JobType.YouNews) {
            await this.bankService.transferBankMoney('farm_you-news', 'safe_you_news', amount * 50);
        }

        this.notifier.notify(source, `Vous avez vendu ~g~${amount} journaux.`);

        TriggerClientEvent(ClientEvent.NEWS_NEWSPAPER_SOLD, source);

        this.monitor.publish(
            'job_news_sell_newspaper',
            {
                player_source: source,
            },
            {
                quantity: amount,
                position: GetEntityCoords(GetPlayerPed(source)),
            }
        );
    }
}
