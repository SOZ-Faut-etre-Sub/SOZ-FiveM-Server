import { useCallback } from 'react';

import { InvoicesEvents } from '../../../../../typings/app/invoices';
import { ServerPromiseResp } from '../../../../../typings/common';
import { fetchNui } from '../../../common/utils/fetchNui';

interface InvoicesAPIValue {
    payInvoice: (id: number) => Promise<void>;
    refuseInvoice: (id: number) => Promise<void>;
}

export const useInvoicesAPI = (): InvoicesAPIValue => {
    const payInvoice = useCallback(async (id: number) => {
        await fetchNui<ServerPromiseResp<number>>(InvoicesEvents.PAY_INVOICE, id);
    }, []);
    const refuseInvoice = useCallback(async (id: number) => {
        await fetchNui<ServerPromiseResp<number>>(InvoicesEvents.REFUSE_INVOICE, id);
    }, []);

    return { payInvoice, refuseInvoice };
};
