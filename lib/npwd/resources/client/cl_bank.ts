import {BankEvents} from "../../typings/bank";
import {sendMessage} from "../utils/messages";
import {Delay} from "../utils/fivem";

onNet('phone:client:bank:updateBalance', async (playerName: string, balance: number) => {
    await Delay(3000);
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        balance: balance
    });
});
