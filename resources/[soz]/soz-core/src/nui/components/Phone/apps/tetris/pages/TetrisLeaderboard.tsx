import { FunctionComponent } from 'react';

import Leaderboard from '../../../components/games/LeaderBoard';
import { useGameTetrisLeaderboard } from '../tetris.atom';

export const TetrisLeaderboard: FunctionComponent = () => {
    const leaderboard = useGameTetrisLeaderboard();

    return <Leaderboard leaderboard={leaderboard} />;
};
