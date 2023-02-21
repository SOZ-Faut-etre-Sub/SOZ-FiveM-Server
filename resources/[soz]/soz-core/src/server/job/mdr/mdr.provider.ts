import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
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
}
