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
    }

    @StateSelector(state => state.radioLongRange.primary.frequency)
    public updatePrimaryFrequency(frequency: number, previousFrequency?: number) {
        const radioLongRange = this.store.getState().radioLongRange;

        if (!radioLongRange.enabled) {
            return;
        }

        if (previousFrequency > 0) {
            this.voipService.disconnectRadio(RadioType.RadioLongRange, RadioChannelType.Primary, previousFrequency);
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(RadioType.RadioLongRange, RadioChannelType.Primary, frequency);
        }
    }

    @StateSelector(state => state.radioLongRange.secondary.frequency)
    public updateSecondaryFrequency(frequency: number, previousFrequency?: number) {
        const radioLongRange = this.store.getState().radioLongRange;

        if (!radioLongRange.enabled) {
            return;
        }

        if (previousFrequency > 0) {
            this.voipService.disconnectRadio(RadioType.RadioLongRange, RadioChannelType.Secondary, previousFrequency);
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(RadioType.RadioLongRange, RadioChannelType.Secondary, frequency);
        }
    }

    @StateSelector(state => state.radioLongRange.primary.ear)
    public updatePrimaryEar(ear: Ear) {
        this.voipService.setRadioEar(RadioType.RadioLongRange, RadioChannelType.Primary, ear);
    }

    @StateSelector(state => state.radioLongRange.secondary.ear)
    public updateSecondaryEar(ear: Ear) {
        this.voipService.setRadioEar(RadioType.RadioLongRange, RadioChannelType.Secondary, ear);
    }

    @StateSelector(state => state.radioLongRange.primary.volume)
    public updatePrimaryVolume(volume: number) {
        this.voipService.setRadioVolume(RadioType.RadioLongRange, RadioChannelType.Primary, volume);
    }

    @StateSelector(state => state.radioLongRange.secondary.volume)
    public updateSecondaryVolume(volume: number) {
        this.voipService.setRadioVolume(RadioType.RadioLongRange, RadioChannelType.Secondary, volume);
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
        this.nuiDispatch.dispatch('radio_vehicle', 'Close');
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
        const volume = channel?.volume || this.store.getState().radioLongRange[type].volume;

        if (!vehicle) {
            return;
        }

        // is drive or copilot
        if (GetPedInVehicleSeat(vehicle, -1) !== PlayerPedId() && GetPedInVehicleSeat(vehicle, 0) !== PlayerPedId()) {
            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.VOIP_RADIO_VEHICLE_UPDATE, vehicleNetworkId, type, channel);
        this.soundService.play('click', volume / 100);
    }

    @OnEvent(ClientEvent.VOIP_RADIO_VEHICLE_ENABLE)
    public onEnableRadioVehicle(vehicleNetworkId: number, enable: boolean) {
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

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
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

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
