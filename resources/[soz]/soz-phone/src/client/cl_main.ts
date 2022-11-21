import { PlayerData } from 'qbcore.js';

import config from '../../config.json';
import { PhoneEvents } from '../../typings/phone';
import { SettingsEvents } from '../../typings/settings';
import { sendMessage } from '../utils/messages';
import { animationService } from './animations/animation.controller';
import { callService } from './calls/cl_calls.controller';
import { RegisterNuiCB } from './cl_utils';
import { ClUtils } from './client';
import { removePhoneProp } from './functions';

// All main globals that are set and used across files
global.isPhoneOpen = false;
global.isPhoneDrowned = false;
global.isPhoneDisabled = false;
global.isPlayerLoaded = false;

const exps = global.exports;

/* Functions */

function cityIsInBlackOut(): boolean {
    return GlobalState.blackout || GlobalState.blackout_level >= 3;
}

/* * * * * * * * * * * * *
 *
 *  Phone initialize data
 *
 * * * * * * * * * * * * */

onNet(PhoneEvents.SET_PLAYER_LOADED, (state: boolean) => {
    global.isPlayerLoaded = state;
    // Whenever a player is unloaded, we need to communicate this to the NUI layer.
    // resetting the global state.
    if (!state) {
        sendMessage('PHONE', PhoneEvents.UNLOAD_CHARACTER, {});
    }
});

RegisterKeyMapping(config.general.toggleCommand, 'Afficher le téléphone', 'keyboard', config.general.toggleKey);
emit('chat:addSuggestion', `${config.general.toggleCommand}`, 'Toggle displaying your cellphone');

const getCurrentGameTime = () => {
    let hour: string | number = GetClockHours();

    let minute: string | number = GetClockMinutes();

    // Format time if need be
    if (hour < 10) hour = `0${hour}`;
    if (minute < 10) minute = `0${minute}`;

    return `${hour}:${minute}`;
};

/* * * * * * * * * * * * *
 *
 *  Phone Visibility Handling
 *
 * * * * * * * * * * * * */

export const showPhone = async (): Promise<void> => {
    global.isPhoneOpen = true;
    const time = getCurrentGameTime();
    await animationService.openPhone(); // Animation starts before the phone is open
    emitNet(PhoneEvents.FETCH_CREDENTIALS);
    SetCursorLocation(0.9, 0.922); //Experimental
    sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, true);
    sendMessage('PHONE', PhoneEvents.SET_TIME, time);
    SetNuiFocus(true, true);
    SetNuiFocusKeepInput(true);
    emit('phone:client:disableControlActions', true);
};

export const hidePhone = async (): Promise<void> => {
    global.isPhoneOpen = false;
    sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, false);
    await animationService.closePhone();
    SetNuiFocus(false, false);
    SetNuiFocusKeepInput(false);
    emit('phone:client:disableControlActions', false);
};

/* * * * * * * * * * * * *
 *
 *  Register Command and Keybinding
 *
 * * * * * * * * * * * * */
RegisterCommand(
    config.general.toggleCommand,
    async () => {
        if (global.isPhoneDisabled) return;
        if (cityIsInBlackOut()) return;

        await togglePhone();
    },
    false
);

/* * * * * * * * * * * * *
 *
 *  Misc. Helper Functions
 *
 * * * * * * * * * * * * */

const checkExportCanOpen = async (): Promise<boolean> => {
    const exportResp = await Promise.resolve(
        exps[config.PhoneAsItem.exportResource][config.PhoneAsItem.exportFunction]()
    );
    if (typeof exportResp !== 'number' && typeof exportResp !== 'boolean') {
        throw new Error('You must return either a boolean or number from your export function');
    }

    return !!exportResp;
};

async function togglePhone(): Promise<void> {
    if (config.PhoneAsItem.enabled) {
        const canAccess = await checkExportCanOpen();
        if (!canAccess) {
            exps['soz-hud'].DrawNotification("Vous n'avez pas de téléphone", 'error');
            return;
        }
    }
    if (global.isPhoneOpen) return await hidePhone();
    await showPhone();
}

onNet(PhoneEvents.SEND_CREDENTIALS, (number: string, societyNumber: string | null) => {
    sendMessage('SIMCARD', PhoneEvents.SET_NUMBER, number);
    sendMessage('SOCIETY_SIMCARD', PhoneEvents.SET_SOCIETY_NUMBER, societyNumber);
});

on('onResourceStop', (resource: string) => {
    if (resource === GetCurrentResourceName()) {
        sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, false);
        sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, false);
        SetNuiFocus(false, false);
        animationService.endPhoneCall();
        animationService.closePhone();
        ClearPedTasks(PlayerPedId()); //Leave here until launch as it'll fix any stuck animations.
        removePhoneProp();
    }
});

onNet('QBCore:Client:OnPlayerLoaded', async () => {
    sendMessage('PHONE', 'phoneRestart', {});
    const canAccess = await checkExportCanOpen();
    sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, canAccess);
});

onNet('QBCore:Player:SetPlayerData', async (playerData: PlayerData) => {
    if (typeof playerData.items === 'object') playerData.items = Object.values(playerData.items);
    const hasItem = playerData.items.find(item => item.name === 'phone');
    sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, !!hasItem);
});

// DO NOT CHANGE THIS EITHER, PLEASE - CHIP
// ^ AND WHAT ARE YOU GOING TO DO HUH? - KIDZ

/* * * * * * * * * * * * *
 *
 *  NUI Service Callback Registration
 *
 * * * * * * * * * * * * */
RegisterNuiCB<void>(PhoneEvents.CLOSE_PHONE, async (_, cb) => {
    await hidePhone();
    cb();
});

// NOTE: This probably has an edge case when phone is closed for some reason
// and we need to toggle keep input off
RegisterNuiCB<{ keepGameFocus: boolean }>(PhoneEvents.TOGGLE_KEYS, async ({ keepGameFocus }, cb) => {
    // We will only
    if (global.isPhoneOpen) SetNuiFocusKeepInput(keepGameFocus);
    cb({});
});

setInterval(async () => {
    const ped = PlayerPedId();

    const isSwimming = IsPedSwimming(ped);
    if (isSwimming) {
        global.isPhoneDisabled = true;
        global.isPhoneDrowned = true;
        if (global.isPhoneOpen) await hidePhone();
        callService.handleEndCall();
        sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, false);
    } else if (!isSwimming && global.isPhoneDrowned) {
        global.isPhoneDisabled = false;
        global.isPhoneDrowned = false;
        sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, true);
    }

    if (global.isPhoneOpen && cityIsInBlackOut()) {
        await hidePhone();
        callService.handleEndCall();
    }
}, 1000);

setInterval(() => {
    const time = getCurrentGameTime();
    sendMessage('PHONE', PhoneEvents.SET_TIME, time);
}, 2000);
