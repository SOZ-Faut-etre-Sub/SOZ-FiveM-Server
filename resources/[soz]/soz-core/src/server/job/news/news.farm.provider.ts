import { InventoryFactory } from '@public/server/inventory/inventory.factory';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { JobType } from '../../../shared/job';
import { Vector3 } from '../../../shared/polyzone/vector';
import { getRandomInt } from '../../../shared/random';
import { isErr } from '../../../shared/result';
import { BankService } from '../../bank/bank.service';
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

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

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

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

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
        const result = inventory.add('newspaper', amount);

        if (isErr(result)) {
            if (result.err == 'not_enough_space') {
                this.notifier.notify(source, 'Vos poches sont pleines...', 'error');
                return false;
            } else {
                this.notifier.notify(source, `Il y a eu une erreur: ${ADD_ERROR_MESSAGE[result.err]}`, 'error');
                return false;
            }
        }

        this.notifier.notify(source, `Vous avez récupéré ~g~${amount} journaux.`);

        this.monitor.traceEvent('job_news_print_newspaper', {
            player_source: source,
            amount: amount,
            position: GetEntityCoords(GetPlayerPed(source)) as Vector3,
        });
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

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const maxAmountInventory = inventory.getItemCount('newspaper');

        if (maxAmountInventory === 0) {
            this.notifier.error(source, "Vous ~r~n'avez plus~s~ de journaux");

            return;
        }

        const amount = getRandomInt(Math.min(10, maxAmountInventory), Math.min(maxAmountInventory, 20));

        if (!inventory.remove('newspaper', amount, false)) {
            this.notifier.error(source, 'Impossible de vendre les journaux');

            return;
        }

        if (player.job.id === JobType.News) {
            await this.bankService.transferFarmMoney(source, 'farm_news', 'safe_news', amount * 50);
        }

        if (player.job.id === JobType.YouNews) {
            await this.bankService.transferFarmMoney(source, 'farm_you-news', 'safe_you-news', amount * 50);
        }

        this.notifier.notify(source, `Vous avez vendu ~g~${amount} journaux.`);

        TriggerClientEvent(ClientEvent.NEWS_NEWSPAPER_SOLD, source);

        this.monitor.traceEvent('job_news_sell_newspaper', {
            player_source: source,
            amount: amount,
            position: GetEntityCoords(GetPlayerPed(source)) as Vector3,
        });
    }
}
