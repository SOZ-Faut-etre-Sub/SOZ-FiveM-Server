import { Provider } from '@core/decorators/provider';
import { Tick } from '@core/decorators/tick';
import { sub2Vector3, Vector3 } from '@public/shared/polyzone/vector';

import { Inject } from '../../core/decorators/injectable';
import { PhoneLightRepository } from '../repository/phone.light.repository';

@Provider()
export class PhoneLights {
    @Inject(PhoneLightRepository)
    private readonly phoneLightRepository: PhoneLightRepository;

    @Tick()
    async onTick() {
        for (const [object, [backlight, flashlight]] of Object.entries(this.phoneLightRepository.raw())) {
            if (backlight) this.drawBacklight(Number(object));
            if (flashlight) this.drawFlashlight(Number(object));
        }
    }

    private drawBacklight(phone: number) {
        if (!NetworkDoesEntityExistWithNetworkId(phone)) return;
        const object = NetToObj(phone);
        if (!DoesEntityExist(object)) return;

        const propCoords = GetEntityCoords(object) as Vector3;

        const frontPhoneCoords = GetOffsetFromEntityInWorldCoords(object, 0, -1, 0) as Vector3;
        const frontPhoneVector = sub2Vector3(frontPhoneCoords, propCoords);

        DrawSpotLight(
            propCoords[0],
            propCoords[1],
            propCoords[2],
            frontPhoneVector[0],
            frontPhoneVector[1],
            frontPhoneVector[2],
            255,
            255,
            255,
            0.6,
            0.2,
            0,
            20,
            1
        );
    }

    private drawFlashlight(phone: number) {
        if (!NetworkDoesEntityExistWithNetworkId(phone)) return;
        const object = NetToObj(phone);
        if (!DoesEntityExist(object)) return;

        const propCoords = GetEntityCoords(object) as Vector3;

        const backPhoneCoords = GetOffsetFromEntityInWorldCoords(object, 0, 1, 0) as Vector3;
        const backPhoneVector = sub2Vector3(backPhoneCoords, propCoords);

        DrawSpotLight(
            propCoords[0],
            propCoords[1],
            propCoords[2],
            backPhoneVector[0],
            backPhoneVector[1],
            backPhoneVector[2],
            255,
            255,
            255,
            20,
            1,
            0,
            23,
            20
        );
    }
}
