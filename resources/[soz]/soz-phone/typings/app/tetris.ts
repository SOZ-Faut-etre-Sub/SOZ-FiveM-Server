export interface TetrisScore {
    score: number;
}

export enum TetrisEvents {
    SEND_SCORE = 'phone:app:tetris:sendScore',
    FETCH_LEADERBOARD = 'phone:app:tetris:fetchLeaderboard',
    BROADCAST_LEADERBOARD = 'phone:app:tetris:broadcastLeaderboard',
}
