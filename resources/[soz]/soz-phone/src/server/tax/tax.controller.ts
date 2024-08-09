import { Taxes, TaxEvents } from '../../../typings/app/tax';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import taxService from './tax.service';
import { taxLogger } from './tax.utils';

onNetPromise<string, Taxes>(TaxEvents.FETCH_TAXES, (reqObj, resp) => {
    taxService.getTaxes(reqObj, resp).catch((e) => {
        taxLogger.error(`Error occured in fetch tax event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
