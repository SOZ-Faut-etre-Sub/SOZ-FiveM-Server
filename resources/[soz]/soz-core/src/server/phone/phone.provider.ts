import { Provider } from '@public/core/decorators/provider';
import { ClientEvent } from '@public/shared/event/client';

import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';

@Provider()
export class PhoneProvider {
    private phoneBacklight = new Set<number>();
    private phoneFlashlight = new Map<number, boolean>();

    @Rpc(RpcServerEvent.PHONE_LIGHT_GET_STATE)
    async getPhonesState() {
        const phonesState = new Map<number, { backlight: boolean; flashlight: boolean }>();
        this.phoneBacklight.forEach(phoneId => {
            phonesState.set(phoneId, {
                backlight: true,
                flashlight: this.phoneFlashlight.has(phoneId),
            });
        });
        return Object.fromEntries(phonesState.entries());
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_ADD_PHONE)
    async setBacklight(_source: number, phoneId: number) {
        this.phoneBacklight.add(phoneId);

        TriggerLatentClientEvent(ClientEvent.PHONE_LIGHT_ADD_PHONE, -1, 1024, phoneId);
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_SET_FLASHLIGHT)
    async setFlashlight(_source: number, phoneId: number, state: boolean) {
        this.phoneFlashlight.set(phoneId, state);

        TriggerLatentClientEvent(ClientEvent.PHONE_LIGHT_SET_FLASHLIGHT, -1, 1024, phoneId, state);
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_REMOVE_PHONE)
    async removePhone(_source: number, phoneId: number) {
        this.phoneBacklight.delete(phoneId);
        this.phoneFlashlight.delete(phoneId);

        TriggerLatentClientEvent(ClientEvent.PHONE_LIGHT_REMOVE_PHONE, -1, 1024, phoneId);
    }
}
