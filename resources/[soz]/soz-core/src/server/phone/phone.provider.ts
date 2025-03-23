import { Provider } from '@public/core/decorators/provider';

import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { PhoneLightRepository } from '../repository/phone.light.repository';

@Provider()
export class PhoneProvider {
    @Inject(PhoneLightRepository)
    private readonly phoneLightRepository: PhoneLightRepository;

    @On('QBCore:Server:PlayerUnload', false)
    async onPlayerUnload(source: number) {
        await this.phoneLightRepository.removeAllPlayerPhones(source);
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_ADD_PHONE)
    async setBacklight(source: number, phoneId: number) {
        if (phoneId === 0) return;

        await this.phoneLightRepository.createPhone(source, phoneId);
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_SET_FLASHLIGHT)
    async setFlashlight(_source: number, phoneId: number, state: boolean) {
        if (phoneId === 0) return;

        await this.phoneLightRepository.setPhoneFlashlight(phoneId, state);
    }

    @Rpc(RpcServerEvent.PHONE_LIGHT_REMOVE_PHONE)
    async removePhone(source: number, phoneId: number) {
        if (phoneId === 0) return;

        await this.phoneLightRepository.removePhone(source, phoneId);
    }
}
