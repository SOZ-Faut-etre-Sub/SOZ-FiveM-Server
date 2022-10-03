export class PlayerRepo {
    async fetchIdentifierFromPhoneNumber(phoneNumber: string): Promise<string | null> {
        const result = await exports.oxmysql.single_async(`SELECT citizenid FROM player WHERE charinfo LIKE ?`, [
            '%' + phoneNumber + '%',
        ]);
        return result['citizenid'] || null;
    }
}

export default new PlayerRepo();
