export interface BankContactItem {
    id: number;
    label: string;
    accountid: string;
}

export enum BankContactsEvents {
    FETCH_ALL_CONTACTS = 'phone:app:bank-contacts:getContacts',
    ADD_CONTACT = 'phone:app:bank-contacts:addContact',
    REMOVE_CONTACT = 'phone:app:bank-contacts:removeContact',
}
