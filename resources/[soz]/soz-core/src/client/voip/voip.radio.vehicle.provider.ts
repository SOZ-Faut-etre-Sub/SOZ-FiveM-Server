import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Ear, Radio, RadioChannel, RadioChannelType, RadioType } from '../../shared/voip';
import { NuiDispatch } from '../nui/nui.dispatch';
import { SoundService } from '../sound.service';
import { StateSelector, Store } from '../store/store';
import { VehicleStateService } from '../vehicle/vehicle.state.service';
import { VoipService } from './voip.service';

@Provider()
export class VoipRadioVehicleProvider {
    @Inject(SoundService)
    private readonly soundService: SoundService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject('Store')
    private store: Store;

    private previousPrimaryFrequency = 0;

    private previousSecondaryFrequency = 0;

    @StateSelector(state => state.radioLongRange.enabled)
    public toggleRadio(enabled: boolean) {
        const radioLongRange = this.store.getState().radioLongRange;

        if (!enabled) {
            this.voipService.disconnectRadio(
                RadioType.RadioLongRange,
                RadioChannelType.Primary,
                radioLongRange.primary.frequency
            );
            this.voipService.disconnectRadio(
                RadioType.RadioLongRange,
                RadioChannelType.Secondary,
                radioLongRange.secondary.frequency
            );

            this.previousPrimaryFrequency = 0;
            this.previousSecondaryFrequency = 0;

            this.soundService.play('radio/toggle', 0.2);

            return;
        }

        if (radioLongRange.primary.frequency > 0) {
            this.voipService.connectRadio(
                RadioType.RadioLongRange,
                RadioChannelType.Primary,
                radioLongRange.primary.frequency
            );
        }

        if (radioLongRange.secondary.frequency > 0) {
            this.voipService.connectRadio(
                RadioType.RadioLongRange,
                RadioChannelType.Secondary,
                radioLongRange.secondary.frequency
            );
        }

        this.soundService.play('radio/toggle', 0.2);
    }

    @StateSelector(state => state.radioLongRange.primary.frequency)
    public updatePrimaryFrequency(frequency: number) {
        const radioLongRange = this.store.getState().radioLongRange;

        if (!radioLongRange.enabled) {
            return;
        }

        if (this.previousPrimaryFrequency > 0) {
            this.voipService.disconnectRadio(
                RadioType.RadioLongRange,
                RadioChannelType.Primary,
                this.previousPrimaryFrequency
            );
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(RadioType.RadioLongRange, RadioChannelType.Primary, frequency);
        }

        this.soundService.play('click', radioLongRange.primary.volume / 100);
        this.previousPrimaryFrequency = frequency;
    }

    @StateSelector(state => state.radioLongRange.secondary.frequency)
    public updateSecondaryFrequency(frequency: number) {
        const radioLongRange = this.store.getState().radioLongRange;

        if (!radioLongRange.enabled) {
            return;
        }

        if (this.previousSecondaryFrequency > 0) {
            this.voipService.disconnectRadio(
                RadioType.RadioLongRange,
                RadioChannelType.Secondary,
                this.previousSecondaryFrequency
            );
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(RadioType.RadioLongRange, RadioChannelType.Secondary, frequency);
        }

        this.soundService.play('click', radioLongRange.secondary.volume / 100);
        this.previousSecondaryFrequency = frequency;
    }

    @StateSelector(state => state.radioLongRange.primary.ear)
    public updatePrimaryEar(ear: Ear) {
        const radioLongRange = this.store.getState().radioLongRange;
        this.voipService.setRadioEar(RadioType.RadioLongRange, RadioChannelType.Primary, ear);
        this.soundService.play('click', radioLongRange.primary.volume / 100);
    }

    @StateSelector(state => state.radioLongRange.secondary.ear)
    public updateSecondaryEar(ear: Ear) {
        const radioLongRange = this.store.getState().radioLongRange;
        this.voipService.setRadioEar(RadioType.RadioLongRange, RadioChannelType.Secondary, ear);
        this.soundService.play('click', radioLongRange.secondary.volume / 100);
    }

    @StateSelector(state => state.radioLongRange.primary.volume)
    public updatePrimaryVolume(volume: number) {
        const radioLongRange = this.store.getState().radioLongRange;
        this.voipService.setRadioVolume(RadioType.RadioLongRange, RadioChannelType.Primary, volume);
        this.soundService.play('click', radioLongRange.primary.volume / 100);
    }

    @StateSelector(state => state.radioLongRange.secondary.volume)
    public updateSecondaryVolume(volume: number) {
        const radioLongRange = this.store.getState().radioLongRange;
        this.voipService.setRadioVolume(RadioType.RadioLongRange, RadioChannelType.Secondary, volume);
        this.soundService.play('click', radioLongRange.secondary.volume / 100);
    }

    @StateSelector(state => state.radioLongRange)
    public updateRadioShortRange(radioShortRange: Radio) {
        this.nuiDispatch.dispatch('radio_vehicle', 'Update', radioShortRange);
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    public async onEnterVehicle() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) !== PlayerPedId() && GetPedInVehicleSeat(vehicle, 0) !== PlayerPedId()) {
            return;
        }

        const vehicleState = await this.vehicleStateService.getVehicleState(vehicle);

        if (!vehicleState.hasRadio) {
            return;
        }

        this.store.dispatch.radioLongRange.enable(vehicleState.radioEnabled);
        this.store.dispatch.radioLongRange.updatePrimary(vehicleState.primaryRadio);
        this.store.dispatch.radioLongRange.updateSecondary(vehicleState.secondaryRadio);
    }
    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public async onLeaveVehicle() {
        this.store.dispatch.radioLongRange.enable(false);
    }

    @OnNuiEvent(NuiEvent.VoipEnableRadioVehicle)
    public async onEnableRadio({ enable }: { enable: boolean }) {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        // is drive or copilot
        if (GetPedInVehicleSeat(vehicle, -1) !== PlayerPedId() && GetPedInVehicleSeat(vehicle, 0) !== PlayerPedId()) {
            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.VOIP_RADIO_VEHICLE_ENABLE, vehicleNetworkId, enable);
    }

    @OnNuiEvent(NuiEvent.VoipUpdateRadioVehicleChannel)
    public async onUpdateRadioChannel({ channel, type }: { channel: Partial<RadioChannel>; type: RadioChannelType }) {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        // is drive or copilot
        if (GetPedInVehicleSeat(vehicle, -1) !== PlayerPedId() && GetPedInVehicleSeat(vehicle, 0) !== PlayerPedId()) {
            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.VOIP_RADIO_VEHICLE_UPDATE, vehicleNetworkId, type, channel);
    }

    @OnEvent(ClientEvent.VOIP_RADIO_VEHICLE_ENABLE)
    public onEnableRadioVehicle(vehicleNetworkId: number, enable: boolean) {
        const vehicle = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicle) {
            return;
        }

        if (vehicle !== GetVehiclePedIsIn(PlayerPedId(), false)) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) !== PlayerPedId() && GetPedInVehicleSeat(vehicle, 0) !== PlayerPedId()) {
            return;
        }

        this.store.dispatch.radioLongRange.enable(enable);
    }

    @OnEvent(ClientEvent.VOIP_RADIO_VEHICLE_UPDATE)
    public onUpdateRadioVehicle(vehicleNetworkId: number, type: RadioChannelType, channel: Partial<RadioChannel>) {
        const vehicle = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicle) {
            return;
        }

        if (vehicle !== GetVehiclePedIsIn(PlayerPedId(), false)) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) !== PlayerPedId() && GetPedInVehicleSeat(vehicle, 0) !== PlayerPedId()) {
            return;
        }

        if (type === RadioChannelType.Primary) {
            this.store.dispatch.radioLongRange.updatePrimary(channel);
        } else {
            this.store.dispatch.radioLongRange.updateSecondary(channel);
        }
    }

    public openRadioInterface() {
        this.nuiDispatch.dispatch('radio_vehicle', 'Open', this.store.getState().radioLongRange);
    }
}
