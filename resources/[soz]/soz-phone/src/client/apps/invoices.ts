import { InvoicesEvents } from '../../../typings/app/invoices';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(InvoicesEvents.FETCH_ALL_INVOICES);
RegisterNuiProxy(InvoicesEvents.PAY_INVOICE);
RegisterNuiProxy(InvoicesEvents.REFUSE_INVOICE);

onNet(InvoicesEvents.FIVEM_EVENT_INVOICE_RECEIVED, async (id: number, label: string, amount: number, emitterName: string) => {
    sendMessage('INVOICES', InvoicesEvents.NEW_INVOICE, {
        id,
        label,
        amount,
        emitterName,
        created_at: new Date().getTime(),
        payed: false,
        refused: false
    });
});

onNet(InvoicesEvents.FIVEM_EVENT_INVOICE_PAID, async (id: number) => {
    sendMessage('INVOICES', InvoicesEvents.REMOVE_INVOICE, id);
});

onNet(InvoicesEvents.FIVEM_EVENT_INVOICE_REJECTED, async (id: number) => {
    sendMessage('INVOICES', InvoicesEvents.REMOVE_INVOICE, id);
});
