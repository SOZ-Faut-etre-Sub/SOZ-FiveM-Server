import { BankEvents } from '../../typings/bank';
import { Delay } from '../utils/fivem';
import { sendMessage } from '../utils/messages';

onNet('phone:client:bank:updateBalance', async (playerName: string, account: string, balance: number) => {
    await Delay(3000);
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        account: account,
        balance: balance,
    });
});
