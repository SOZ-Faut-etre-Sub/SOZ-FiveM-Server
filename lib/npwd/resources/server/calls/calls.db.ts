import {CallHistoryItem} from '../../../typings/call';
import {FetchDefaultLimits} from '../utils/ServerConstants';
import DbInterface from '../db/db_wrapper';

export class CallsRepo {
    async saveCall(call: CallHistoryItem): Promise<void> {
        const query =
            'INSERT INTO phone_calls (identifier, transmitter, receiver) VALUES (?, ?, ?)';
        await DbInterface._rawExec(query, [
            call.identifier,
            call.transmitter,
            call.receiver,
        ]);
    }

    async updateCall(call: CallHistoryItem, isAccepted: boolean, end: number): Promise<void> {
        const query = 'UPDATE phone_calls SET is_accepted=?, end=current_timestamp() WHERE identifier = ?';
        await DbInterface._rawExec(query, [isAccepted, call.identifier]);
    }

    async fetchCalls(
        phoneNumber: string,
        limit = FetchDefaultLimits.CALLS_FETCH_LIMIT,
    ): Promise<CallHistoryItem[]> {
        const query =
            'SELECT * FROM phone_calls WHERE receiver = ? OR transmitter = ? ORDER BY id DESC LIMIT ?';
        const [result] = await DbInterface._rawExec(query, [phoneNumber, phoneNumber, limit]);

        return <CallHistoryItem[]>result;
    }
}

export default new CallsRepo();
