export type NewsMessage = {
    id?: number;
    type:
        | 'annonce'
        | 'breaking-news'
        | 'publicité'
        | 'fait-divers'
        | 'info-trafic'
        | 'lspd'
        | 'lspd:end'
        | 'bcso'
        | 'bcso:end'
        | 'sasp'
        | 'sasp:end'
        | 'gouv'
        | 'gouv:end'
        | string;
    reporter?: string;
    reporterId?: string;
    image?: string;
    message: string;
    createdAt?: number;
    job: string;
};
