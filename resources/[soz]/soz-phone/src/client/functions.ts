import { Delay } from '../utils/fivem';

let prop = 0;
let propCreated = false;
const phoneModel = 'soz_prop_phone';

/* * * * * * * * * * * * *
 *
 *  Prop Deletion/Creation handling
 *
 * * * * * * * * * * * * */

// TODO: add a option to make server side for people who use entity lockdown.

export const newPhoneProp = async () => {
    removePhoneProp(); //deletes the already existing prop before creating another.
    if (!propCreated) {
        RequestModel(phoneModel);

        while (!HasModelLoaded(phoneModel)) {
            await Delay(1);
        }

        const playerPed = PlayerPedId();
        const [x, y, z] = GetEntityCoords(playerPed, true);
        prop = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true);
        const netId = ObjToNet(prop);
        SetNetworkIdCanMigrate(netId, false);
        TriggerServerEvent('soz-core:client:object:attached:register', netId);
        SetEntityCollision(prop, false, true);
        const boneIndex = GetPedBoneIndex(playerPed, 28422);
        AttachEntityToEntity(
            prop,
            playerPed,
            boneIndex,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            -0.0,
            true,
            true,
            false,
            true,
            1.0,
            true
        ); //-- Attaches the phone to the player.
        propCreated = true;
    } else if (propCreated) {
        console.log('prop already created');
    }
};

export function removePhoneProp() {
    //-- Triggered in newphoneProp function. Only way to destory the prop correctly.
    if (prop != 0) {
        TriggerServerEvent('soz-core:client:object:attached:unregister', ObjToNet(prop));
        DeleteEntity(prop);
        prop = 0;
        propCreated = false;
    }
}
