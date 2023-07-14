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

    useNuiEvent('taxi', 'setStatus', status => {
        dispatch.taxi.update(status);
    });

    useNuiEvent('hud', 'UpdateVoiceMode', voiceMode => {
        dispatch.hud.update({ voiceMode });
    });

    useNuiEvent('hud', 'UpdateMinimap', minimap => {
        dispatch.hud.update({ minimap });
    });

    useNuiEvent('hud', 'UpdateVehicle', vehicle => {
        dispatch.vehicle.update(vehicle);
    });

    useNuiEvent('hud', 'UpdateVehicleSpeed', vehicle => {
        dispatch.vehicleSpeed.update(vehicle);
    });

    useNuiEvent('player', 'UpdatePlayerStats', stats => {
        dispatch.playerStats.update(stats);
    });

    return null;
};
