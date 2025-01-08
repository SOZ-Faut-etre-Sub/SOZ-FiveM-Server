import { LeaderboardInterface } from '@public/shared/phone/apps/game';
import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

const leaderboardAtom = atom<LeaderboardInterface[]>([]);

export const useGameTetrisLeaderboard = () => useAtomValue(leaderboardAtom);

export const useAppTetrisStateHandlers = () => {
    const setLeaderboard = useSetAtom(leaderboardAtom);

    useNuiEvent('phone', 'AppTetrisSetLeaderboard', setLeaderboard);

    useInjectDebugData(() => {
        setLeaderboard([
            { citizenid: '', avatar: '', player_name: 'John Doe', score: 1000, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'Jane Doe', score: 900, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'John Smith', score: 800, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'Jane Smith', score: 700, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'John Johnson', score: 600, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'Jane Johnson', score: 500, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'John Brown', score: 400, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'Jane Brown', score: 300, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'John White', score: 200, game_played: 10 },
            { citizenid: '', avatar: '', player_name: 'Jane White', score: 100, game_played: 10 },
        ]);
    });
};
