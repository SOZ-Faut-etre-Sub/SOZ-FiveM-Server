import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { SnakeEvents } from '@typings/app/snake';
import { useEffect } from 'react';

import { store } from '../../store';

export const useAppSnakeLeaderboardService = () => {
    useEffect(() => {
        store.dispatch.appSnakeLeaderboard.loadLeaderboard();
    }, []);

    useNuiEvent('SNAKE', SnakeEvents.BROADCAST_LEADERBOARD, store.dispatch.appSnakeLeaderboard.broadcastLeaderboard);
};
