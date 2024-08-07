import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { Notifier } from '../notifier';

@Provider()
export class BankInvoiceProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ClientEvent.BANK_PHONE_INVOICE_RECEIVED)
    public async onInvoiceReceive(invoiceId: string, label: string, amount: number) {
        const confirmed = await this.notifier.notifyWithConfirm(
            `Vous avez reçu une facture de ~r~$${amount}~s~~n~Raison:${label}.~n~~n~Faites ~g~Y~s~ pour l'accepter ou ~r~N~s~ pour la refuser`
        );

        if (!confirmed) {
            TriggerServerEvent(ServerEvent.BANK_INVOICE_REJECT, invoiceId);
            return;
        }

        TriggerServerEvent(ServerEvent.BANK_INVOICE_PAY, invoiceId);
    }
}
