import { SnakeEvents } from '@typings/snake';
import { useEffect } from 'react';

import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { store } from '../../store';

export const useAppSnakeService = () => {
    useEffect(() => {
        store.dispatch.appSnake.getSnakeHighscore();
    }, []);

    useNuiEvent('SNAKE', SnakeEvents.UPDATE_HIGHSCORE, store.dispatch.appSnake.getSnakeHighscore);
};
