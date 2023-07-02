import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { SnakeEvents } from '@typings/snake';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchNui } from '../../../utils/fetchNui';

export const useSnakeAPI = () => {
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();

    const updateHighscore = useCallback(
        (highscore: number) => {
            fetchNui<ServerPromiseResp>(SnakeEvents.SET_HIGHSCORE, highscore).then(resp => {
                if (resp.status !== 'ok') {
                    return addAlert({
                        message: t('SNAKE.FEEDBACK.UPDATE_HIGHSCORE_FAILED'),
                        type: 'error',
                    });
                }
            });
        },
        [addAlert, t]
    );

    return { updateHighscore };
};
