import { FunctionComponent } from 'react';

import { RepositoryType } from '../../../../../../shared/repository';
import { useRepository } from '../../../../../hook/repository';
import Leaderboard from '../../../components/games/LeaderBoard';

export const SnakeLeaderboard: FunctionComponent = () => {
    const snakeLeaderboard = useRepository(RepositoryType.LeaderboardSnake);
    const leaderboard = Object.values(snakeLeaderboard).sort((a, b) => b.score - a.score);

    return <Leaderboard leaderboard={leaderboard} />;
};
