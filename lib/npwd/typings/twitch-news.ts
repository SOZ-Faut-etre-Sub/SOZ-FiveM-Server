export interface TwitchNewsMessage {
  id?: number;
  type: 'annonce' | 'breaking-news' | 'publicité' | 'fait-divers' | 'info-traffic';
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
}
