import { Taxes } from '../../../typings/app/tax';

export class _TaxDB {
    getDBTax(): Promise<Taxes> {
        return exports.oxmysql.query_async(`SELECT id, value FROM tax;`, []);
    }
}

const TaxDB = new _TaxDB();

export default TaxDB;
