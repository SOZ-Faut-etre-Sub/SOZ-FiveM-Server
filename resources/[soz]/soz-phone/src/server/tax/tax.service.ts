import { Taxes } from '../../../typings/app/tax';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import TaxDB, { _TaxDB } from './tax.db';
import { taxLogger } from './tax.utils';

class _TaxService {
    private readonly taxDB: _TaxDB;

    constructor() {
        this.taxDB = TaxDB;
        taxLogger.debug('tax service started');
    }

    async getTaxes(reqObj: PromiseRequest<string>, resp: PromiseEventResp<Taxes>): Promise<void> {
        try {
            const taxes = await this.taxDB.getDBTax();
            resp({ status: 'ok', data: taxes });
        } catch (e) {
            taxLogger.error(`Error in getTaxes, ${e}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const taxService = new _TaxService();

export default taxService;
