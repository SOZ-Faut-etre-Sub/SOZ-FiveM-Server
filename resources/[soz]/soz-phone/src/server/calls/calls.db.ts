import { CallHistoryItem } from "../../../typings/call";
import { FetchDefaultLimits } from "../utils/ServerConstants";

export class CallsRepo {
    async saveCall(call: CallHistoryItem): Promise<void> {
        await exports.oxmysql.insert_async("INSERT INTO phone_calls (identifier, transmitter, receiver) VALUES (?, ?, ?)", [
            call.identifier,
            call.transmitter,
            call.receiver,
        ]);
    }

    async updateCall(call: CallHistoryItem, isAccepted: boolean): Promise<void> {
        await exports.oxmysql.update_async("UPDATE phone_calls SET is_accepted=?, end=current_timestamp() WHERE identifier = ?", [isAccepted, call.identifier]);
    }
}

export default new CallsRepo();
