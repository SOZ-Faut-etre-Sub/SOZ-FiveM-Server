import {BankEvents} from "../../typings/bank";
import {sendMessage} from "../utils/messages";
import {Delay} from "../utils/fivem";

onNet('phone:client:bank:updateBalance', async (playerName: string, account: string, balance: number) => {
    await Delay(3000);
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        account: account,
        balance: balance
    });
});
