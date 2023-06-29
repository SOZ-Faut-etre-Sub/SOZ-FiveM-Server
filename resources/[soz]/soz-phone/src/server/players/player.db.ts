export class PlayerRepo {
    async fetchIdentifierFromPhoneNumber(phoneNumber: string): Promise<string | null> {
        const result = await exports.oxmysql.single_async(`SELECT citizenid FROM player WHERE charinfo LIKE ?`, [
            '%' + phoneNumber + '%',
        ]);

        return result?.citizenid || null;
    }

    async fetchIdentifierFromAccount(account: string): Promise<string | null> {
        const result = await exports.oxmysql.single_async(`SELECT citizenid FROM player WHERE charinfo LIKE ?`, [
            '%"account":"' + account + '"%',
        ]);

        return result?.citizenid || null;
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

export default new PlayerRepo();
