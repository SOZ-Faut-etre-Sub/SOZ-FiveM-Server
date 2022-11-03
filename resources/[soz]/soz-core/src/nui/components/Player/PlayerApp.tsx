import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { useNuiEvent } from '../../hook/nui';
import { Dispatch } from '../../store';

export const PlayerApp: FunctionComponent = () => {
    const dispatch = useDispatch<Dispatch>();

    useNuiEvent('player', 'Update', data => {
        dispatch.player.update(data);
    });

    return null;
};
