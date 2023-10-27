import { PlayerData } from 'qbcore.js';

import config from '../../config.json';
import { EmergencyEvents } from '../../typings/emergency';
import { PhoneEvents } from '../../typings/phone';
import { sendMessage } from '../utils/messages';
import { animationService } from './animations/animation.controller';
import { callService, endCallHandler } from './calls/cl_calls.controller';
import { RegisterNuiCB } from './cl_utils';
import { removePhoneProp } from './functions';

// All main globals that are set and used across files
global.isPhoneOpen = false;
global.isPhoneDrowned = false;
global.isPhoneDisabled = false;
global.isPlayerLoaded = false;
global.isPlayerHasItem = false;
global.isBlackout = false;

const exps = global.exports;

/* Functions */
function cityIsInBlackOut(): boolean {
    const globalState = exps['soz-core'].GetGlobalState();

    return globalState.blackout || globalState.blackoutLevel >= 3;
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
RegisterCommand(config.general.toggleCommand, togglePhone, false);
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
    const state = exports['soz-core'].GetPlayerState();

    if (!state.isDead) {
        await animationService.openPhone(); // Animation starts before the phone is open
    }

    emitNet(PhoneEvents.FETCH_CREDENTIALS);
    SetCursorLocation(0.9, 0.922); //Experimental
    sendMessage('PHONE', EmergencyEvents.SET_EMERGENCY, state.isDead);
    sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, true);
    sendMessage('PHONE', PhoneEvents.SET_TIME, time);
    SetNuiFocus(true, true);
    SetNuiFocusKeepInput(true);
    emit('phone:client:disableControlActions', true);
};

export const hidePhone = async (): Promise<void> => {
    global.isPhoneOpen = false;
    sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, false);
    const state = exports['soz-core'].GetPlayerState();

    if (!state.isDead) {
        await animationService.closePhone();
    }

    SetNuiFocus(false, false);
    SetNuiFocusKeepInput(false);
    emit('phone:client:disableControlActions', false);
};

/* * * * * * * * * * * * *
 *
 *  Phone Availability Handling
 *
 * * * * * * * * * * * * */

export const updateAvailability = async () => {
    const state = exports['soz-core'].GetPlayerState();
    const avail =
        (!global.isPhoneDrowned && !global.isPhoneDisabled && global.isPlayerHasItem && !global.isBlackout) ||
        !!state.isDead;
    sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, avail);

    if (!avail) {
        if (global.isPhoneOpen) {
            await hidePhone();
        }
        if (callService.isInCall()) {
            endCallHandler({
                transmitterNumber: callService.getTransmitterNumber(),
                isTransmitter: callService.isTransmitter(),
            });
            await animationService.endPhoneCall();
        }
    }
};

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
    const isEditorModeActive = exports['soz-core'].IsEditorModeActive();
    if (isEditorModeActive) {
        return;
    }

    if (global.isPhoneOpen) {
        return await hidePhone();
    }

    const state = exports['soz-core'].GetPlayerState();

    if (!state.isDead) {
        if (global.isPhoneDrowned) return;
        if (global.isPhoneDisabled) return;
        if (cityIsInBlackOut()) return;

        if (config.PhoneAsItem.enabled) {
            const canAccess = await checkExportCanOpen();
            if (!canAccess) {
                return;
            }
        }
    }
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
    updateAvailability();
    const state = exports['soz-core'].GetPlayerState();

    sendMessage('PHONE', EmergencyEvents.SET_EMERGENCY, state.isDead);
});

onNet('QBCore:Player:SetPlayerData', async (playerData: PlayerData) => {
    if (typeof playerData.items === 'object') playerData.items = Object.values(playerData.items);
    global.isPlayerHasItem = !!playerData.items.find(item => item.name === 'phone');

    updateAvailability();
    sendMessage('PHONE', EmergencyEvents.SET_EMERGENCY, playerData.metadata['isdead']);
});

onNet('ems:client:onDeath', () => {
    callService.handleEndCall();
    animationService.endPhoneCall();
    hidePhone();

    sendMessage('PHONE', EmergencyEvents.SET_EMERGENCY, true);
    sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, true);
});

onNet('soz-core:lsmc:client:revive', async () => {
    sendMessage('PHONE', EmergencyEvents.SET_EMERGENCY, false);
    const canAccess = await checkExportCanOpen();
    sendMessage('PHONE', PhoneEvents.SET_AVAILABILITY, canAccess);
});

onNet('soz-core:client:injury:death', async (raison: string) => {
    sendMessage('PHONE', EmergencyEvents.SET_DEAD, raison);
});

/* * * * * * * * * * * * *
 *
 *  NUI Service Callback Registration
 *
 * * * * * * * * * * * * */
RegisterNuiCB<void>(PhoneEvents.CLOSE_PHONE, async (_, cb) => {
    await hidePhone();
    cb({});
});

RegisterNuiCB<{ keepGameFocus: boolean }>(PhoneEvents.TOGGLE_KEYS, async ({ keepGameFocus }, cb) => {
    if (global.isPhoneOpen) SetNuiFocusKeepInput(keepGameFocus);
    cb({});
});

RegisterNuiCB<void>(EmergencyEvents.LSMC_CALL, async (_, cb) => {
    TriggerEvent('soz-core:lsmc:client:call');
    cb({});
});

RegisterNuiCB<void>(EmergencyEvents.UHU_CALL, async (_, cb) => {
    TriggerServerEvent('soz-core:lsmc:server:revive', null, true, true);
    hidePhone();
    cb({});
});

RegisterNuiCB<void>(PhoneEvents.PHONE_LOADED, async (_, cb) => {
    updateAvailability();
    cb({});
});

setInterval(async () => {
    const ped = PlayerPedId();
    const isSwimming = IsPedSwimming(ped);
    if (isSwimming && !global.isPhoneDrowned) {
        global.isPhoneDrowned = true;
        updateAvailability();
    } else if (!isSwimming && global.isPhoneDrowned) {
        global.isPhoneDrowned = false;
        updateAvailability();
    }

    if (global.isBlackout != cityIsInBlackOut()) {
        global.isBlackout = cityIsInBlackOut();
        updateAvailability();
    }

    if (exports['progressbar'].IsDoingAction()) {
        if (global.isPhoneOpen) {
            await hidePhone();
        }
    }
}, 1000);

setInterval(() => {
    const time = getCurrentGameTime();
    sendMessage('PHONE', PhoneEvents.SET_TIME, time);
}, 2000);
