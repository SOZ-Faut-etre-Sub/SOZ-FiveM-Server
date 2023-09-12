export interface SnakeScore {
    score: number;
}

export enum SnakeEvents {
    SEND_SCORE = 'phone:app:snake:sendScore',
    FETCH_LEADERBOARD = 'phone:app:snake:fetchLeaderboard',
    BROADCAST_LEADERBOARD = 'phone:app:snake:broadcastLeaderboard',
}
