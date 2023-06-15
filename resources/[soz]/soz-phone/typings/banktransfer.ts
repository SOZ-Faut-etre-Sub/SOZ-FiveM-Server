export interface BankTransfer {
    id: number;
    amount: number;
    transmitterAccount: string;
    receiverAccount: string;
    transmitterName: string;
    receiverName: string;
    createdAt?: string;
}

export enum TransfersListEvents {
    FETCH_TRANSFERS = 'phone:app:bank:fetchTransfers',
    TRANSFER_BROADCAST = 'phone:app:bank:transferBroadcast',
}
