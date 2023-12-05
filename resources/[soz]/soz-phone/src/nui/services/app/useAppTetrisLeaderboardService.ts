import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { TetrisEvents } from '@typings/app/tetris';
import { useEffect } from 'react';

import { store } from '../../store';

export const useAppTetrisLeaderboardService = () => {
    useEffect(() => {
        store.dispatch.appTetrisLeaderboard.loadLeaderboard();
    }, []);

    useNuiEvent('TETRIS', TetrisEvents.BROADCAST_LEADERBOARD, store.dispatch.appTetrisLeaderboard.broadcastLeaderboard);
};
