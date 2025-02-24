import { Provider } from '@core/decorators/provider';
import { Tick } from '@core/decorators/tick';
import { emitRpc } from '@core/rpc';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { ClientEvent } from '@public/shared/event/client';
import { sub2Vector3, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class PhoneLights {
    private phonesBacklight = new Set<number>();
    private phonesFlashlight = new Map<number, boolean>();

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded() {
        const state = await emitRpc<Record<number, { backlight: boolean; flashlight: boolean }>>(
            RpcServerEvent.PHONE_LIGHT_GET_STATE
        );

        for (const [phone, { backlight, flashlight }] of Object.entries(state)) {
            if (backlight) this.phonesBacklight.add(Number(phone));
            if (flashlight) this.phonesFlashlight.set(Number(phone), true);
        }
    }

    @OnEvent(ClientEvent.PHONE_LIGHT_ADD_PHONE)
    async onAddPhone(phone: number) {
        this.phonesBacklight.add(phone);
    }

    @OnEvent(ClientEvent.PHONE_LIGHT_SET_FLASHLIGHT)
    async onSetFlashlight(phone: number, enabled: boolean) {
        this.phonesFlashlight.set(phone, enabled);
    }

    @OnEvent(ClientEvent.PHONE_LIGHT_REMOVE_PHONE)
    async onRemovePhone(phone: number) {
        this.phonesBacklight.delete(phone);
        this.phonesFlashlight.delete(phone);
    }

    @Tick()
    async onTick() {
        for (const object of this.phonesBacklight) {
            this.drawBacklight(object);
        }

        for (const [object, enabled] of this.phonesFlashlight.entries()) {
            if (!enabled) continue;
            this.drawFlashlight(object);
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
