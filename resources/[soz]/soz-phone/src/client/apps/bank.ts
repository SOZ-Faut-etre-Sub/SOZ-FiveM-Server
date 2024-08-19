import { BankEvents } from '../../../typings/app/bank';
import { BankContactItem, BankContactsEvents } from '../../../typings/app/bank_contacts';
import { BankStatementItem, BankStatementsEvents } from '../../../typings/app/bank_statements';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(BankEvents.FIVEM_EVENT_FETCH_BALANCE);
RegisterNuiProxy(BankStatementsEvents.FETCH_LAST_STATEMENTS);
RegisterNuiProxy(BankContactsEvents.FETCH_ALL_CONTACTS);

onNet(BankEvents.FIVEM_EVENT_UPDATE_BALANCE, async (playerName: string, account: string, balance: number) => {
    sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
        name: playerName,
        account: account,
        balance: balance,
    });
});

onNet(BankStatementsEvents.NEW_STATEMENT, async (statement: BankStatementItem) => {
    sendMessage('BANK', BankStatementsEvents.NEW_STATEMENT, statement);
});

onNet(BankContactsEvents.ADD_CONTACT, async (contact: BankContactItem) => {
    sendMessage('BANK', BankContactsEvents.ADD_CONTACT, contact);
});

onNet(BankContactsEvents.REMOVE_CONTACT, async (id: number) => {
    sendMessage('BANK', BankContactsEvents.REMOVE_CONTACT, id);
});
