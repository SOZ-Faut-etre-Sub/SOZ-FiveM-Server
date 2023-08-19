export interface TetrisScore {
    score: number;
}

export interface TetrisLeaderboard {
    citizenid: string;
    player_name: string;
    score: number;
    game_played: number;
}

export enum TetrisEvents {
    SEND_SCORE = 'phone:app:tetris:sendScore',
    FETCH_LEADERBOARD = 'phone:app:tetris:fetchLeaderboard',
    BROADCAST_LEADERBOARD = 'phone:app:tetris:broadcastLeaderboard',
}
