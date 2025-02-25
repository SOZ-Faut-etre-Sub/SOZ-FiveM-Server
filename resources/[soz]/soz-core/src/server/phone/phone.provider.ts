import { Provider } from '@public/core/decorators/provider';
import { ClientEvent } from '@public/shared/event/client';

import { On } from '../../core/decorators/event';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';

@Provider()
export class PhoneProvider {
    private playerPhone: Record<number, number[]> = {};
    private phoneBacklight = new Set<number>();
    private phoneFlashlight = new Map<number, boolean>();

    @On('QBCore:Server:PlayerUnload', false)
    async onPlayerUnload(source: number) {
        for (const phone of this.playerPhone[source]) {
            await this.removePhone(source, phone);
        }

        delete this.playerPhone[source];
    }

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
    async setBacklight(source: number, phoneId: number) {
        if (phoneId === 0) return;
        if (!this.playerPhone[source]) this.playerPhone[source] = [];

        this.playerPhone[source].push(phoneId);
        this.phoneBacklight.add(phoneId);

        TriggerLatentClientEvent(ClientEvent.PHONE_LIGHT_ADD_PHONE, -1, 1024, phoneId);
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_SET_FLASHLIGHT)
    async setFlashlight(_source: number, phoneId: number, state: boolean) {
        if (phoneId === 0) return;
        if (!this.phoneBacklight.has(phoneId)) return;
        if (state === null) state = false;

        this.phoneFlashlight.set(phoneId, state);

        TriggerLatentClientEvent(ClientEvent.PHONE_LIGHT_SET_FLASHLIGHT, -1, 1024, phoneId, state);
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_REMOVE_PHONE)
    async removePhone(source: number, phoneId: number) {
        if (phoneId === 0) return;
        this.phoneBacklight.delete(phoneId);
        this.phoneFlashlight.delete(phoneId);

        this.playerPhone[source].filter(id => id !== phoneId);
        if (this.playerPhone[source].length === 0) delete this.playerPhone[source];

        TriggerLatentClientEvent(ClientEvent.PHONE_LIGHT_REMOVE_PHONE, -1, 1024, phoneId);
    }
}
