import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { BankEvents } from '@typings/app/bank';
import { useEffect } from 'react';

import { BankContactsEvents } from '../../../../typings/app/bank_contacts';
import { BankStatementsEvents } from '../../../../typings/app/bank_statements';
import { InvoicesEvents } from '../../../../typings/app/invoices';
import { store } from '../../store';

export const useAppBankService = () => {
    useEffect(() => {
        store.dispatch.appBank.loadCredentials();
        store.dispatch.appBankStatements.loadBankStatements();
        store.dispatch.appBankContacts.loadBankStatements();
        store.dispatch.appInvoices.loadInvoices();
    }, []);

    useNuiEvent('BANK', BankEvents.SEND_CREDENTIALS, store.dispatch.appBank.setCredentials);

    useNuiEvent('BANK', BankStatementsEvents.NEW_STATEMENT, store.dispatch.appBankStatements.addHistory);

    useNuiEvent('BANK', BankContactsEvents.ADD_CONTACT, store.dispatch.appBankContacts.addContact);
    useNuiEvent('BANK', BankContactsEvents.REMOVE_CONTACT, store.dispatch.appBankContacts.removeContact);

    useNuiEvent('INVOICES', InvoicesEvents.NEW_INVOICE, store.dispatch.appInvoices.addInvoice);
    useNuiEvent('INVOICES', InvoicesEvents.REMOVE_INVOICE, store.dispatch.appInvoices.deleteInvoice);
};
