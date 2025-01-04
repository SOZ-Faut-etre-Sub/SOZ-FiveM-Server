import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { useCallback } from 'react';

interface InvoicesAPIValue {
    payInvoice: (id: number) => Promise<void>;
    refuseInvoice: (id: number) => Promise<void>;
}

export const useInvoicesAPI = (): InvoicesAPIValue => {
    const payInvoice = useCallback(async (id: number) => {
        await fetchNui(NuiEvent.PhoneAppBankPayInvoice, id);
    }, []);

    const refuseInvoice = useCallback(async (id: number) => {
        await fetchNui(NuiEvent.PhoneAppBankRejectInvoice, id);
    }, []);

    return { payInvoice, refuseInvoice };
};
