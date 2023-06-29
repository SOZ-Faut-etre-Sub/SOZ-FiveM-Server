import { BankTransfer } from '../../../typings/banktransfer';

export class _BankTransferDB {
    async getTransfers(account: string): Promise<BankTransfer[]> {
        return await exports.oxmysql.query_async(
            'SELECT *, unix_timestamp(createdAt)*1000 as createdAt FROM bank_transfers WHERE createdAt > date_sub(now(), interval 7 day) AND (receiverAccount = ? OR transmitterAccount = ?)',
            [account, account]
        );
    }
}

const BankTransferDb = new _BankTransferDB();
export default BankTransferDb;
