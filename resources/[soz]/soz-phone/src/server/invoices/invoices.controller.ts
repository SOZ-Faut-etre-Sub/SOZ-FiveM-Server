import { InvoiceItem, InvoicesEvents } from '../../../typings/app/invoices';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import InvoicesService from './invoices.service';
import { invoicesLogger } from './invoices.utils';

onNetPromise<void, InvoiceItem[]>(InvoicesEvents.FETCH_ALL_INVOICES, (reqObj, resp) => {
    InvoicesService.handleFetchInvoices(reqObj, resp).catch(e => {
        invoicesLogger.error(`Error occurred in fetch bill event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<number, void>(InvoicesEvents.PAY_INVOICE, async (reqObj, resp) => {
    InvoicesService.handlePayInvoice(reqObj, resp).catch(e => {
        invoicesLogger.error(`Error occured in delete note event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<number, void>(InvoicesEvents.REFUSE_INVOICE, async (reqObj, resp) => {
    InvoicesService.handleRefuseInvoice(reqObj, resp).catch(e => {
        invoicesLogger.error(`Error occured in fetch note event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});
