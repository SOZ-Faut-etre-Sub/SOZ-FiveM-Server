export class _BankTransferDB {
    /**
     * Create a bank transfer in the database
     * @param transmitter - the bankId to the player who sent the money
     * @param receiver - the bankId to the player who received the money
     * @param amount - amount of the transfer
     */
    async createTransfer(transmitter: string, receiver: string, amount: number): Promise<number> {
        const id = await exports.oxmysql.insert_async(
            'INSERT INTO bank_transfers (amount, transmitter, receiver) VALUES (?, ?, ?)',
            [amount, transmitter, receiver]
        );

        return id;
    }
}

const BankTransferDB = new _BankTransferDB();

export default BankTransferDB;
