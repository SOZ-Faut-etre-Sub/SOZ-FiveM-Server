import { BankEvents } from '../../../typings/app/bank';
import { TransfersListEvents } from '../../../typings/banktransfer';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(BankEvents.FIVEM_EVENT_FETCH_BALANCE);
RegisterNuiProxy(TransfersListEvents.FETCH_TRANSFERS);

onNet(BankEvents.FIVEM_EVENT_UPDATE_BALANCE, async (playerName: string, account: string, balance: number) => {
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        account: account,
        balance: balance,
    });
});
