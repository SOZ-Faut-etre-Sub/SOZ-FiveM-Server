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

    useNuiEvent('player', 'UpdatePosition', data => {
        dispatch.playerPosition.update(data);
    });

    useNuiEvent('item', 'SetItems', items => {
        dispatch.item.set(items);
    });

    useNuiEvent('taxi', 'setStatus', status => {
        dispatch.taxi.update(status);
    });

    useNuiEvent('hud', 'SetTheme', theme => {
        dispatch.hud.updateSettings({ theme });
    });

    useNuiEvent('hud', 'SetAvailableTheme', availableTheme => {
        dispatch.hud.updateSettings({ availableTheme });
    });

    useNuiEvent('hud', 'SetZoom', zoom => {
        dispatch.hud.updateSettings({ zoom });
    });

    useNuiEvent('hud', 'SetInventorySize', inventorySize => {
        dispatch.hud.updateSettings({ inventorySize });
    });

    useNuiEvent('hud', 'SetShowDateTime', showDateTime => {
        dispatch.hud.updateSettings({ showDateTime });
    });

    useNuiEvent('hud', 'SetShowWeather', showWeather => {
        dispatch.hud.updateSettings({ showWeather });
    });

    useNuiEvent('hud', 'SetShowStreetName', showStreetName => {
        dispatch.hud.updateSettings({ showStreetName });
    });

    useNuiEvent('hud', 'SetShowCompass', showCompass => {
        dispatch.hud.updateSettings({ showCompass });
    });

    useNuiEvent('hud', 'SetShowStress', showStress => {
        dispatch.hud.updateSettings({ showStress });
    });

    useNuiEvent('hud', 'SetShowStamina', showStamina => {
        dispatch.hud.updateSettings({ showStamina });
    });

    useNuiEvent('hud', 'SetShowInstructionalOverlay', showInstructionalOverlay => {
        dispatch.hud.updateSettings({ showInstructionalOverlay });
    });

    useNuiEvent('hud', 'UpdateSettings', settings => {
        dispatch.hud.update({ settings });
    });

    useNuiEvent('hud', 'UpdateHasWatch', hasWatch => {
        dispatch.hud.update({ hasWatch });
    });

    useNuiEvent('hud', 'UpdateVoiceMode', voiceMode => {
        dispatch.hud.update({ voiceMode });
    });

    useNuiEvent('hud', 'UpdateMinimap', minimap => {
        dispatch.hud.update({ minimap });
    });

    useNuiEvent('hud', 'UpdateDateTime', dateTime => {
        dispatch.hud.update({ dateTime });
    });

    useNuiEvent('hud', 'UpdateWeaponAmmo', ammo => {
        dispatch.hud.update({ ammo });
    });

    useNuiEvent('hud', 'UpdateStreetName', streetName => {
        dispatch.hud.update({ streetName });
    });

    useNuiEvent('hud', 'UpdateCompass', compass => {
        dispatch.hud.update({ compass });
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

    useNuiEvent('player', 'UpdateInventory', ({ configuration, items }) => {
        dispatch.playerInventory.update(configuration, items);
    });

    useNuiEvent('drug', 'SetLocations', data => {
        dispatch.drugLocation.setZones(data);
    });

    useNuiEvent('drug', 'AddUpdateLocation', data => {
        dispatch.drugLocation.addUpdateZone(data);
    });

    useNuiEvent('drug', 'DeleteLocation', data => {
        dispatch.drugLocation.removeZone(data);
    });

    useNuiEvent('repository', 'Set', data => {
        dispatch.repository.set(data.type, data.data);
    });

    useNuiEvent('hud', 'UpdateArmorPlates', nbPlates => {
        dispatch.hud.update({ armorPlates: nbPlates });
    });

    useNuiEvent('feature', 'Set', data => {
        dispatch.features.set(data);
    });

    useNuiEvent('halloween', 'moon', moon => {
        dispatch.hud.update({ halloween: { moon } });
    });

    return null;
};
