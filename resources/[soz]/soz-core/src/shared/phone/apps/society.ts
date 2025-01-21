export type SocietyContact = {
    display: string;
    number: string;
    avatar: string;
    type: 'public' | 'private' | 'urgence';
    order?: number;
};
