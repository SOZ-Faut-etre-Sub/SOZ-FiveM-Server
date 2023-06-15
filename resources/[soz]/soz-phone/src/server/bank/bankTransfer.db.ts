import { BankTransfer } from '../../../typings/banktransfer';

export class _BankTransferDB {
    async getTransfers(account: string): Promise<BankTransfer[]> {
        return await exports.oxmysql.query_async(
            'SELECT *, unix_timestamp(createdAt)*1000 as createdAt FROM bank_transfers WHERE createdAt > date_sub(now(), interval 7 day) AND (receiverAccount = ? OR transmitterAccount = ?)',
            [account, account]
        );
    }

    async getNameFromAccount(account: string): Promise<string> {
        const charinfos = await exports.oxmysql.query_async(
            'SELECT charinfo FROM player WHERE charinfo LIKE ? LIMIT 1',
            ['%"account":"' + account + '"%']
        );
        if (charinfos.length > 0) {
            const charinfo = JSON.parse(charinfos[0].charinfo);
            return `${charinfo.firstname} ${charinfo.lastname}`;
        } else {
            return account;
        }
    }
}

const BankTransferDb = new _BankTransferDB();
export default BankTransferDb;
