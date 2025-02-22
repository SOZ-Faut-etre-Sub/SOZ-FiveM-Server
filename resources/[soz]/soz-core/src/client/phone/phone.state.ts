import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick } from '@core/decorators/tick';
import { AnimationService } from '@public/client/animation/animation.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { AttachedObjectService } from '@public/client/object/attached.object.service';
import { PlayerService } from '@public/client/player/player.service';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { StateSelector } from '@public/client/store/store';
import { ActiveCall } from '@public/shared/phone/simcard';

const KVP_PHONE_PROP_MODEL = 'soz_phone_prop_model';

@Provider()
export class PhoneState {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private readonly animationService: AnimationService;

    @Inject(AttachedObjectService)
    private readonly attachedObjectService: AttachedObjectService;

    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    private phonePropModel = GetResourceKvpString(KVP_PHONE_PROP_MODEL) ?? 'soz_phone_black';
    private phoneProp: number | null = null;
    private phoneOpen = false;
    private phoneDisabled = false;
    private phoneDrowned = false;
    private cityIsInBlackOut = false;

    private phoneOnCamera = false;
    private phoneFrontCameraEnabled = false;

    private currentCall: ActiveCall | null = null;

    public setPhonePropModel(model: 'soz_phone_black' | 'soz_phone_gold' | 'soz_phone_natural' | 'soz_phone_white') {
        this.phonePropModel = model;
        SetResourceKvp(KVP_PHONE_PROP_MODEL, model);
    }

    public isPhoneDisabled() {
        return this.cityIsInBlackOut || this.phoneDrowned || this.phoneDisabled;
    }

    public isPhoneDrowned() {
        return this.phoneDrowned;
    }

    public setPhoneDrowned(value: boolean) {
        this.phoneDrowned = value;
        if (value) {
            this.setPhoneOpen(false);
        }
    }

    public isPhoneOpen() {
        return this.phoneOpen;
    }

    public setPhoneOpen(value: boolean) {
        this.phoneOpen = value;
        this.nuiDispatch.dispatch('phone', 'SetVisibility', value);
    }

    public setPhoneFocus(value: boolean) {
        this.nuiDispatch.dispatch('phone', 'SetPhoneDisableFocus', !value);
    }

    public setPhoneDisabled(value: boolean) {
        this.phoneDisabled = value;
        this.nuiDispatch.dispatch('phone', 'SetAvailability', !value);

        if (value) {
            this.setPhoneOpen(false);
            this.setPhoneOnCamera(false);
            this.setPhoneFrontCameraEnabled(false);
        }
    }

    public isPhoneOnCamera() {
        return this.phoneOnCamera;
    }

    public isPhoneFrontCameraEnabled() {
        return this.phoneFrontCameraEnabled;
    }

    public setPhoneOnCamera(value: boolean) {
        this.phoneOnCamera = value;
    }

    public setPhoneFrontCameraEnabled(value: boolean) {
        if (this.phoneFrontCameraEnabled === value) return;

        this.phoneFrontCameraEnabled = value;
        Citizen.invokeNative('0x2491A93618B7D838', value);
    }

    public getCurrentCall() {
        return this.currentCall;
    }

    public getTargetCallerId() {
        if (!this.currentCall) return null;

        return this.currentCall.isTransmitter ? this.currentCall.receiverSource : this.currentCall.transmitterSource;
    }

    public setCurrentCall(call: ActiveCall | null) {
        this.currentCall = call;
    }

    public isInCall() {
        return this.currentCall !== null;
    }

    public isInActiveCall() {
        return this.currentCall !== null && (this.currentCall.isTransmitter || this.currentCall.is_accepted);
    }

    @StateSelector(state => state.global.blackout, state => state.global.blackoutLevel)
    async onBlackout(blackout: boolean, blackoutLevel: number) {
        this.cityIsInBlackOut = blackout || blackoutLevel >= 3;
    }

    @Tick(250)
    async onTick() {
        const playerPed = PlayerPedId();
        const isPlayerInVehicle = IsPedInAnyVehicle(playerPed, false);

        if (this.playerService.getState().isDead) return;
        if (this.phoneOnCamera) return;

        if (this.isInActiveCall()) {
            await this.triggerAnimation(
                playerPed,
                isPlayerInVehicle ? 'anim@cellphone@in_car@ps' : 'cellphone@',
                'cellphone_call_listen_base'
            );
        } else if (this.phoneOpen) {
            await this.triggerAnimation(
                playerPed,
                isPlayerInVehicle ? 'anim@cellphone@in_car@ps' : 'cellphone@',
                'cellphone_text_in'
            );
        } else if (!this.phoneOpen && this.phoneProp !== null) {
            if (isPlayerInVehicle) {
                ['cellphone_text_in', 'cellphone_call_to_text', 'cellphone_call_listen_base'].forEach(anim => {
                    this.clearAnimation(playerPed, 'anim@cellphone@in_car@ps', anim);
                });
            } else {
                this.clearAnimation(playerPed, 'cellphone@', 'cellphone_text_in');

                this.animationService.playAnimationIfNotRunning({
                    base: {
                        dictionary: isPlayerInVehicle ? 'anim@cellphone@in_car@ps' : 'cellphone@',
                        name: 'cellphone_text_out',
                        duration: 200,
                        options: {
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                });
            }
        }

        if (this.phoneOpen) {
            await this.createPhoneProp();
        } else if (!this.isInCall()) {
            await this.removePhoneProp();
        }
    }

    private async createPhoneProp() {
        if (this.phoneProp !== null) return;

        SetPedConfigFlag(PlayerPedId(), 104, false);
        this.phoneProp = await this.attachedObjectService.attachObjectToPlayer({
            bone: 28422,
            model: this.phonePropModel,
            position: [0, 0.0, 0.0],
            rotation: [0, 0, 0],
            rotationOrder: 1,
        });
    }

    private async removePhoneProp() {
        if (this.phoneProp === null) return;

        SetPedConfigFlag(PlayerPedId(), 104, true);
        this.attachedObjectService.detachObjectToPlayer(this.phoneProp);
        this.phoneProp = null;
    }

    private async triggerAnimation(playerPed: number, dictionary: string, name: string) {
        if (IsEntityPlayingAnim(playerPed, dictionary, name, 3)) return;

        await this.resourceLoader.loadAnimationDictionary(dictionary);
        TaskPlayAnim(playerPed, dictionary, name, 8.0, -1, -1, 50, 0, false, false, false);
    }

    private clearAnimation(playerPed: number, dictionary: string, name: string) {
        if (!IsEntityPlayingAnim(playerPed, dictionary, name, 3)) return;

        StopAnimTask(playerPed, dictionary, name, 3);
    }
}
