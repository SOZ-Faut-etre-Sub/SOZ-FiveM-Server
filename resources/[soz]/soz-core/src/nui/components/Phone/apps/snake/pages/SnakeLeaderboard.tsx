import { FunctionComponent } from 'react';

import Leaderboard from '../../../components/games/LeaderBoard';
import { useGameSnakeLeaderboard } from '../snake.atom';

export const SnakeLeaderboard: FunctionComponent = () => {
    const leaderboard = useGameSnakeLeaderboard();

    return <Leaderboard leaderboard={leaderboard} />;
};
