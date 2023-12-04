export interface TwitchNewsMessage {
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
        | 'gouv:end';
    reporter?: string;
    reporterId?: string;
    image?: string;
    message: string;
    createdAt?: string;
    job: string;
}

export enum SocietiesDatabaseLimits {
    message = 255,
}

export enum TwitchNewsEvents {
    FETCH_NEWS = 'phone:app:news:fetchNews',
    RELOAD_NEWS = 'phone:app:news:reloadNews',
    CREATE_NEWS_BROADCAST = 'phone:app:news:createNewsBroadcast',
    API_NEWS_BROADCAST = 'soz-core:server:news:add-flash',
}
