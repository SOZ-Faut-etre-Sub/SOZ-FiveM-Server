import DbInterface from '../db/db_wrapper';

export class PlayerRepo {
  async fetchIdentifierFromPhoneNumber(phoneNumber: string): Promise<string | null> {
    const query = `SELECT citizenid FROM player WHERE charinfo LIKE ?`;
    const [results] = await DbInterface._rawExec(query, ['%'+phoneNumber+'%']);
    // Get identifier from results
    return (results as any[])[0]['citizenid'] || null;
  }
}

export default new PlayerRepo();
