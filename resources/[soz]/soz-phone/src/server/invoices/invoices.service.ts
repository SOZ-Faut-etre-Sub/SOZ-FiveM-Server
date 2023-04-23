import { InvoiceItem } from '../../../typings/app/invoices';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { invoicesLogger } from './invoices.utils';
class _InvoicesService {
    constructor() {
        invoicesLogger.debug('Invoices service started');
    }

    async handleFetchInvoices(reqObj: PromiseRequest<void>, resp: PromiseEventResp<InvoiceItem[]>) {
        try {
            resp({ status: 'ok', data: exports['soz-bank'].GetAllInvoicesForPlayer(reqObj.source) });
        } catch (e) {
            invoicesLogger.error(`Error in handleFetchInvoices, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handlePayInvoice(reqObj: PromiseRequest<number>, resp: PromiseEventResp<void>) {
        try {
            exports['soz-bank'].PayInvoice(reqObj.source, reqObj.data);
            resp({ status: 'ok' });
        } catch (e) {
            invoicesLogger.error(`Error in handlePayInvoice, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handleRefuseInvoice(reqObj: PromiseRequest<number>, resp: PromiseEventResp<void>) {
        try {
            exports['soz-bank'].RejectInvoice(reqObj.source, reqObj.data);
            resp({ status: 'ok' });
        } catch (e) {
            invoicesLogger.error(`Error in handleRefuseInvoice, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const InvoicesService = new _InvoicesService();
export default InvoicesService;
