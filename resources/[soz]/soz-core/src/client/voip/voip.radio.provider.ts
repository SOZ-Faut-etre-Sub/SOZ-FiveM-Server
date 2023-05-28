import { Command } from '../../core/decorators/command';
import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { Ear, Radio, RadioChannel, RadioChannelType, RadioType } from '../../shared/voip';
import { AnimationService } from '../animation/animation.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../sound.service';
import { StateSelector, Store } from '../store/store';
import { VoipService } from './voip.service';

@Provider()
export class VoipRadioProvider {
    @Inject(SoundService)
    private readonly soundService: SoundService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject('Store')
    private store: Store;

    private radioInUse = false;

    private previousPrimaryFrequency = 0;

    private previousSecondaryFrequency = 0;

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(): Promise<void> {
        const hasRadio = this.inventoryManager.hasEnoughItem('radio', 1, true);

        if (!hasRadio && this.radioInUse) {
            this.closeRadioInterface();
        }

        this.store.dispatch.radioShortRange.enable(false);
    }

    @StateSelector(state => state.radioShortRange.enabled)
    public toggleRadio(enabled: boolean) {
        const radioShortRange = this.store.getState().radioShortRange;

        this.soundService.play('radio/toggle', 0.2);

        if (!enabled) {
            this.voipService.disconnectRadio(
                RadioType.RadioShortRange,
                RadioChannelType.Primary,
                radioShortRange.primary.frequency
            );
            this.voipService.disconnectRadio(
                RadioType.RadioShortRange,
                RadioChannelType.Secondary,
                radioShortRange.secondary.frequency
            );

            this.previousPrimaryFrequency = 0;
            this.previousSecondaryFrequency = 0;

            return;
        }

        if (radioShortRange.primary.frequency > 0) {
            this.voipService.connectRadio(
                RadioType.RadioShortRange,
                RadioChannelType.Primary,
                radioShortRange.primary.frequency
            );
        }

        if (radioShortRange.secondary.frequency > 0) {
            this.voipService.connectRadio(
                RadioType.RadioShortRange,
                RadioChannelType.Secondary,
                radioShortRange.secondary.frequency
            );
        }
    }

    @StateSelector(state => state.radioShortRange.primary.frequency)
    public updatePrimaryFrequency(frequency: number) {
        const radioShortRange = this.store.getState().radioShortRange;

        if (!radioShortRange.enabled) {
            return;
        }

        if (this.previousPrimaryFrequency > 0) {
            this.voipService.disconnectRadio(
                RadioType.RadioShortRange,
                RadioChannelType.Primary,
                this.previousPrimaryFrequency
            );
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(RadioType.RadioShortRange, RadioChannelType.Primary, frequency);
        }

        this.soundService.play('click', radioShortRange.primary.volume / 100);
        this.previousPrimaryFrequency = frequency;
    }

    @StateSelector(state => state.radioShortRange.secondary.frequency)
    public updateSecondaryFrequency(frequency: number) {
        const radioShortRange = this.store.getState().radioShortRange;

        if (!radioShortRange.enabled) {
            return;
        }

        if (this.previousSecondaryFrequency > 0) {
            this.voipService.disconnectRadio(
                RadioType.RadioShortRange,
                RadioChannelType.Secondary,
                this.previousSecondaryFrequency
            );
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(RadioType.RadioShortRange, RadioChannelType.Secondary, frequency);
        }

        this.soundService.play('click', radioShortRange.secondary.volume / 100);
        this.previousSecondaryFrequency = frequency;
    }

    @StateSelector(state => state.radioShortRange.primary.ear)
    public updatePrimaryEar(ear: Ear) {
        const radioShortRange = this.store.getState().radioShortRange;
        this.voipService.setRadioEar(RadioType.RadioShortRange, RadioChannelType.Primary, ear);
        this.soundService.play('click', radioShortRange.primary.volume / 100);
    }

    @StateSelector(state => state.radioShortRange.secondary.ear)
    public updateSecondaryEar(ear: Ear) {
        const radioShortRange = this.store.getState().radioShortRange;
        this.voipService.setRadioEar(RadioType.RadioShortRange, RadioChannelType.Secondary, ear);
        this.soundService.play('click', radioShortRange.secondary.volume / 100);
    }

    @StateSelector(state => state.radioShortRange.primary.volume)
    public updatePrimaryVolume(volume: number) {
        const radioShortRange = this.store.getState().radioShortRange;
        this.voipService.setRadioVolume(RadioType.RadioShortRange, RadioChannelType.Primary, volume);
        this.soundService.play('click', radioShortRange.primary.volume / 100);
    }

    @StateSelector(state => state.radioShortRange.secondary.volume)
    public updateSecondaryVolume(volume: number) {
        const radioShortRange = this.store.getState().radioShortRange;
        this.voipService.setRadioVolume(RadioType.RadioShortRange, RadioChannelType.Secondary, volume);
        this.soundService.play('click', radioShortRange.secondary.volume / 100);
    }

    @StateSelector(state => state.radioShortRange)
    public updateRadioShortRange(radioShortRange: Radio) {
        this.nuiDispatch.dispatch('radio', 'Update', radioShortRange);
    }

    @OnNuiEvent(NuiEvent.VoipEnableRadio)
    public async onEnableRadio({ enable }: { enable: boolean }) {
        this.store.dispatch.radioShortRange.enable(enable);
    }

    @OnNuiEvent(NuiEvent.VoipCloseRadio)
    public async onCloseRadio() {
        this.closeRadioInterface();
    }

    @OnNuiEvent(NuiEvent.VoipUpdateRadioChannel)
    public async onUpdateRadioChannel({ channel, type }: { channel: Partial<RadioChannel>; type: RadioChannelType }) {
        if (type === RadioChannelType.Primary) {
            this.store.dispatch.radioShortRange.updatePrimary(channel);
        } else {
            this.store.dispatch.radioShortRange.updateSecondary(channel);
        }
    }

    @OnEvent(ClientEvent.VOIP_ITEM_RADIO_TOGGLE)
    @Command('radio_toggle', {
        description: 'Sortir la radio.',
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'N',
            },
        ],
    })
    public onRadioToggle() {
        if (this.radioInUse) {
            this.closeRadioInterface();
        } else {
            if (!IsNuiFocused()) {
                this.openRadioInterface();
            }
        }
    }

    public isRadioOpen() {
        return this.radioInUse;
    }

    public openRadioInterface() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (
            player.metadata.isdead ||
            player.metadata.ishandcuffed ||
            player.metadata.inlaststand ||
            IsPauseMenuActive()
        ) {
            return;
        }

        this.radioInUse = true;
        this.animationService.playAnimationIfNotRunning({
            base: {
                dictionary: 'cellphone@',
                name: 'cellphone_text_read_base',
                options: {
                    repeat: true,
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
            props: [
                {
                    model: 'prop_cs_hand_radio',
                    bone: 57005,
                    position: [0.14, 0.01, -0.02],
                    rotation: [110.0, 120.0, -15.0],
                },
            ],
        });

        this.nuiDispatch.dispatch('radio', 'Open', this.store.getState().radioShortRange);
    }

    public closeRadioInterface() {
        this.radioInUse = false;
        this.animationService.stopAnimationIfRunning({
            base: {
                dictionary: 'cellphone@',
                name: 'cellphone_text_read_base',
            },
        });
        this.nuiDispatch.dispatch('radio', 'Close');
    }
}
