import { InvoiceItem, InvoicesEvents } from '@typings/app/invoices';
import { useEffect } from 'react';
import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { store } from '../../store';

export const useAppInvoicesService = () => {
    useEffect(() => {
        store.dispatch.appInvoices.loadInvoices();
    }, []);

    useNuiEvent('INVOICES', InvoicesEvents.NEW_INVOICE, store.dispatch.appInvoices.addInvoice);
    useNuiEvent('INVOICES', InvoicesEvents.REMOVE_INVOICE, store.dispatch.appInvoices.deleteInvoice);
};
