import { BankEvents } from '../../../typings/app/bank';
import { Delay } from '../../utils/fivem';
import { sendMessage } from '../../utils/messages';

onNet(BankEvents.FIVEM_EVENT_UPDATE_BALANCE, async (playerName: string, account: string, balance: number) => {
    await Delay(3000);
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        account: account,
        balance: balance,
    });
});
