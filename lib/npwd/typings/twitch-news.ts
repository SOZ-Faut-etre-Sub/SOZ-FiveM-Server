export interface TwitchNewsMessage {
  id?: number;
  type: 'annonce' | 'breaking-news' | 'publicité' | 'fait-divers' | 'info-traffic' | 'lspd' | 'lspd:end' | 'bcso' | 'bcso:end';
  reporter?: string;
  image?: string;
  message: string;
  createdAt?: string;
}

export enum SocietiesDatabaseLimits {
  message = 255,
}

export enum TwitchNewsEvents {
  FETCH_NEWS = 'phone:app:news:fetchNews',
  CREATE_NEWS_BROADCAST = 'phone:app:news:createNewsBroadcast',
  API_NEWS_BROADCAST = 'soz-api:server:AddFlashNews',
}
