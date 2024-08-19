import { IBankCredentials } from '../../../../../typings/app/bank';
import { BankContactItem } from '../../../../../typings/app/bank_contacts';
import { BankStatementItem } from '../../../../../typings/app/bank_statements';
import { InvoiceItem } from '../../../../../typings/app/invoices';

export const MockBankAccountData: IBankCredentials = {
    name: 'John Doe',
    account: '555Z5555T555',
    balance: 1258745,
};

export const BrowserInvoicesData: InvoiceItem[] = [
    {
        id: 1,
        label: "Chateau Marius - Violation de secret d`'enquête",
        emitterName: 'Los Santos Police Department',
        amount: 500,
        createdAt: new Date('2023-02-23 13:29:43').getTime(),
    },
    {
        id: 2,
        label: 'Facture 3',
        emitterName: 'Federal Bureau of Investigation',
        amount: 5500,
        createdAt: new Date('2023-02-20 13:29:45').getTime(),
    },
    {
        id: 3,
        label: 'Facture 1',
        emitterName: 'Blaine County Sheriff Office',
        amount: 50000,
        createdAt: new Date().getTime(),
    },
    {
        id: 4,
        label: 'Facture 1',
        emitterName: 'Los Santos Medical Center',
        amount: 50000,
        createdAt: new Date('2023-01-23 13:29:59').getTime(),
    },
];

export const BrowserHistoryData: BankStatementItem[] = [
    {
        id: 1,
        date: new Date().getTime(),
        source_accountid: '555Z5555T555',
        source_label: 'John Doe',
        target_accountid: 'gouv',
        target_label: 'Gouvernement',
        reason: '',
        amount: 10,
    },
    {
        id: 2,
        date: new Date('2023-01-23 13:29:59').getTime(),
        source_accountid: '555Z5555T555',
        source_label: 'John Doe',
        target_accountid: 'gouv',
        target_label: 'Gouvernement',
        reason: 'Impôt sur le revenu',
        amount: 100,
    },
    {
        id: 3,
        date: new Date('2023-01-22 13:29:59').getTime(),
        source_accountid: 'taxi',
        source_label: 'Carl Jr',
        target_accountid: '555Z5555T555',
        target_label: 'John Doe',
        reason: 'Salaire',
        amount: 100000,
    },
    {
        id: 4,
        date: new Date('2023-01-22 13:29:59').getTime(),
        source_accountid: 'taxi',
        source_label: 'Carl Jr',
        target_accountid: '555Z5555T555',
        target_label: 'John Doe',
        reason: 'Une raison vraiment mais alors vraiment très longue',
        amount: 100000,
    },
    {
        id: 5,
        date: new Date('2023-01-10 13:29:59').getTime(),
        source_accountid: 'taxi',
        source_label: 'Carl Jr',
        target_accountid: '555Z5555T555',
        target_label: 'John Doe',
        reason: '😍',
        amount: 100000,
    },
];

export const BrowserContactsData: BankContactItem[] = [
    {
        id: 1,
        label: 'Mon entreprise',
        accountid: 'taxi',
    },
];
