import { InvoiceItem } from '@typings/app/invoices';

export const BrowserInvoicesData: InvoiceItem[] = [
    {
        id: 1,
        label: "Chateau Marius - Violation de secret d`'enquête",
        emitterName: 'Los Santos Police Department',
        amount: 500,
        created_at: new Date('2023-02-23 13:29:43').getTime(),
    },
    {
        id: 2,
        label: 'Facture 3',
        emitterName: 'Federal Bureau of Investigation',
        amount: 5500,
        created_at: new Date('2023-02-20 13:29:45').getTime(),
    },
    {
        id: 3,
        label: 'Facture 1',
        emitterName: 'Blaine County Sheriff Office',
        amount: 50000,
        created_at: new Date().getTime(),
    },
    {
        id: 4,
        label: 'Facture 1',
        emitterName: 'Los Santos Medical Center',
        amount: 50000,
        created_at: new Date('2023-01-23 13:29:59').getTime(),
    },
];
