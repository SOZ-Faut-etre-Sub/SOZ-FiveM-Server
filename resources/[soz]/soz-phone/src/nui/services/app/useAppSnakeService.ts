import { useEffect } from 'react';

import { store } from '../../store';

export const useAppSnakeService = () => {
    useEffect(() => {
        store.dispatch.appSnake.getSnakeHighscore();
    }, []);
};
