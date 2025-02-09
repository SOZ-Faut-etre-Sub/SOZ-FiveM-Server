import { FunctionComponent } from 'react';

import { RepositoryType } from '../../../../../../shared/repository';
import { useRepository } from '../../../../../hook/repository';
import Leaderboard from '../../../components/games/LeaderBoard';

export const TetrisLeaderboard: FunctionComponent = () => {
    const tetrisLeaderboard = useRepository(RepositoryType.LeaderboardTetris);
    const leaderboard = Object.values(tetrisLeaderboard).sort((a, b) => b.score - a.score);

    return <Leaderboard leaderboard={leaderboard} />;
};
