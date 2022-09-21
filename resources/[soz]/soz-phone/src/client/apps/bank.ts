import { BankEvents } from '../../../typings/app/bank';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(BankEvents.FIVEM_EVENT_FETCH_BALANCE);

onNet(BankEvents.FIVEM_EVENT_UPDATE_BALANCE, async (playerName: string, account: string, balance: number) => {
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        account: account,
        balance: balance,
    });
});
