import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick } from '@core/decorators/tick';
import { AnimationService } from '@public/client/animation/animation.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { AttachedObjectService } from '@public/client/object/attached.object.service';
import { StateSelector } from '@public/client/store/store';
import { ActiveCall } from '@public/shared/phone/simcard';

@Provider()
export class PhoneState {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(AttachedObjectService)
    private attachedObjectService: AttachedObjectService;

    private phoneProp: number | null = null;
    private phoneOpen = false;
    private phoneDisabled = false;
    private phoneDrowned = false;
    private cityIsInBlackOut = false;

    private phoneOnCamera = false;
    private phoneFrontCameraEnabled = false;

    private currentCall: ActiveCall | null = null;

    public isPhoneDisabled() {
        return this.cityIsInBlackOut || this.phoneDisabled;
    }

    public isPhoneDrowned() {
        return this.phoneDrowned;
    }

    public isPhoneOpen() {
        return this.phoneOpen;
    }

    public setPhoneOpen(value: boolean) {
        this.phoneOpen = value;
        this.nuiDispatch.dispatch('phone', 'SetVisibility', value);

        const playerPed = PlayerPedId();

        if (value) {
            if (IsPedInAnyVehicle(playerPed, true)) {
                this.triggerAnimation(playerPed, 'anim@cellphone@in_car@ps', 'cellphone_text_in');
            } else {
                this.triggerAnimation(playerPed, 'cellphone@', 'cellphone_text_in');
            }
        }
    }

    public setPhoneDisabled(value: boolean) {
        this.phoneDisabled = value;
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

    public setCurrentCall(call: ActiveCall | null) {
        this.currentCall = call;
    }

    public isInCall() {
        return this.currentCall !== null && this.currentCall.is_accepted;
    }

    @StateSelector(state => state.global.blackout, state => state.global.blackoutLevel)
    async onBlackout(blackout: boolean, blackoutLevel: number) {
        this.cityIsInBlackOut = blackout || blackoutLevel >= 3;
    }

    @Tick(250)
    async onTick() {
        const playerPed = PlayerPedId();

        if (this.phoneOnCamera) return;

        if (this.isInCall()) {
            if (IsPedInAnyVehicle(playerPed, true)) {
                this.triggerAnimation(playerPed, 'anim@cellphone@in_car@ps', 'cellphone_call_listen_base');
            } else {
                this.triggerAnimation(playerPed, 'cellphone@', 'cellphone_call_listen_base');
            }
        } else if (this.phoneOpen) {
            if (IsPedInAnyVehicle(playerPed, true)) {
                this.triggerAnimation(playerPed, 'anim@cellphone@in_car@ps', 'cellphone_text_in');
            } else {
                this.triggerAnimation(playerPed, 'cellphone@', 'cellphone_text_in');
            }
        } else if (!this.phoneOpen && this.phoneProp !== null) {
            if (IsPedInAnyVehicle(playerPed, true)) {
                ['cellphone_text_in', 'cellphone_call_to_text', 'cellphone_call_listen_base'].forEach(anim => {
                    this.animationService.stopAnimationIfRunning({
                        base: {
                            dictionary: 'anim@cellphone@in_car@ps',
                            name: anim,
                        },
                    });
                });
            } else {
                this.animationService.stopAnimationIfRunning({
                    base: {
                        dictionary: 'cellphone@',
                        name: 'cellphone_text_in',
                    },
                });

                this.animationService.playAnimationIfNotRunning({
                    base: {
                        dictionary: 'cellphone@',
                        name: 'cellphone_text_out',
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
        } else {
            await this.removePhoneProp();
        }

        SetPedConfigFlag(playerPed, 104, this.phoneOpen);
    }

    private async createPhoneProp() {
        if (this.phoneProp !== null) return;

        this.phoneProp = await this.attachedObjectService.attachObjectToPlayer({
            bone: 28422,
            model: 'soz_prop_phone',
            position: [0, 0.0, 0.0],
            rotation: [0, 0, 0],
            rotationOrder: 1,
        });
    }

    private async removePhoneProp() {
        if (this.phoneProp === null) return;

        this.attachedObjectService.detachObjectToPlayer(this.phoneProp);
        this.phoneProp = null;
    }

    private triggerAnimation(playerPed: number, dictionary: string, name: string) {
        if (IsEntityPlayingAnim(playerPed, dictionary, name, 3)) return;

        TaskPlayAnim(playerPed, dictionary, name, 8.0, -1, -1, 50, 0, false, false, false);
    }
}
