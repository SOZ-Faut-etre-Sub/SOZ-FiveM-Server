import {BankEvents} from "../../typings/bank";
import {sendMessage} from "../utils/messages";

onNet('phone:client:bank:updateBalance', (playerName: string, balance: number) => {
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        balance: balance
    });
});
