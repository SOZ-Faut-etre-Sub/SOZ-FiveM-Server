export interface ServerPromiseResp<T = undefined> {
    errorMsg?: string;
    status: 'ok' | 'error' | 'silence';
    data?: T;
}

export interface LeaderboardInterface {
    citizenid: string;
    avatar: string;
    player_name: string;
    score: number;
    game_played: number;
}
