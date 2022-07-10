export interface PlayerAddData {
    source: number;
    identifier: string;
    phoneNumber?: string;
    firstname?: string;
    lastname?: string;
}

export interface CreatePlayerInstance {
    source: number;
    username: string;
    identifier: string;
    phoneNumber: string;
}
