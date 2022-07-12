import { atom } from 'recoil';

export const bankState = {
    transactions: atom({
        key: 'transactionList',
        default: [],
    }),
    bankModal: atom({
        key: 'modalVisibility',
        default: false,
    }),
    bankCredentials: atom({
        key: 'bankCredentails',
        default: {
            name: 'John Doe',
            account: '555Z5555T555',
            balance: 1258745,
        },
    }),
    notification: atom({
        key: 'bankNotification',
        default: null,
    }),
};
