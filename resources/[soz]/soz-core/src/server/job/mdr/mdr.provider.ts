import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';
import { ItemService } from '@public/server/item/item.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerService } from '@public/server/player/player.service';
import { ProgressService } from '@public/server/player/progress.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/item';

const FORMAT_LOCALIZED: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'CET',
};

@Provider()
export class MdrProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.Start)
    public async onInit() {
        this.itemService.setItemUseCallback('newcomer_ticket', this.useTicket.bind(this));
    }

    public useTicket(source: number, item: any, inventoryItem: InventoryItem) {
        TriggerClientEvent(ClientEvent.MDR_USE_TICKET, source, inventoryItem.metadata.expiration);
    }

    @OnEvent(ServerEvent.MDR_SHOW_TICKET)
    public showTicket(source: number, target: number, dlc: string) {
        const expiration = new Date(dlc);
        this.notifier.notify(
            target,
            `Le ticket nouvel arrivant présenté est valable jusqu'à ${expiration.toLocaleDateString(
                'fr-FR',
                FORMAT_LOCALIZED
            )}`,
            'info'
        );
    }

    @OnEvent(ServerEvent.MDR_MONEY_CLEANING)
    public async onMoneyCleaning(source: number) {
        let first = false;

        while (this.canWash(source)) {
            if (!first) {
                this.notifier.notify(source, 'Vous ~g~commencez~s~ à réhabiliter des billets.', 'info');
                first = true;
            }

            const completed = await this.doWash(source);

            if (completed) {
                this.monitor.publish(
                    'mdr_wash',
                    {
                        player_source: source,
                    },
                    {}
                );

                this.notifier.notify(source, `Vous avez réhabilité ~r~1000$~s~ en ~g~$400~s~.`);
            } else {
                this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de réhabiliter.');
                return;
            }
        }

        this.notifier.notify(source, "Vous n'avez pas assez d'agent sale.", 'error');
    }

    private canWash(source: number): boolean {
        const player = this.playerService.getPlayer(source);
        return player.money.marked_money >= 1000;
    }

    private async doWash(source: number): Promise<boolean> {
        const { completed } = await this.progressService.progress(
            source,
            'hub_wash',
            'Réhabilitation en cours...',
            4000,
            {
                dictionary: 'anim@mp_radio@garage@low',
                name: 'action_a',
                flags: 1,
            },
            {
                disableCombat: true,
                disableCarMovement: true,
                disableMovement: true,
            }
        );

        if (!completed) {
            return false;
        }

        const player = this.playerService.getPlayer(source);
        if (player.money.marked_money < 1000) {
            return false;
        }

        this.playerMoneyService.remove(source, 1000, 'marked_money');
        this.playerMoneyService.add(source, 400, 'money');

        return true;
    }
}
