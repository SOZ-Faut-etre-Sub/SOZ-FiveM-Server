import { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { NuiEvent } from '../../shared/event';
import { fetchNui } from '../fetch';
import { useNuiEvent } from '../hook/nui';
import { Dispatch } from '../store';

export const StateApp: FunctionComponent = () => {
    const dispatch = useDispatch<Dispatch>();

    useEffect(() => {
        fetchNui(NuiEvent.Loaded);
    }, []);

    useNuiEvent('player', 'Update', data => {
        dispatch.player.update(data);
    });

    useNuiEvent('item', 'SetItems', items => {
        dispatch.item.set(items);
    });

    return null;
};
