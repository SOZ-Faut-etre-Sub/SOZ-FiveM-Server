import { PlayerInventoryUpdate } from '@public/core/decorators/player';

import { Command } from '../../core/decorators/command';
import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { Radio, RadioChannel, RadioChannelType, RadioType } from '../../shared/voip';
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

    @PlayerInventoryUpdate()
    async onPlayerUpdate(): Promise<void> {
        const hasRadio = this.inventoryManager.hasEnoughItem('radio', 1, true);

        if (!hasRadio && this.radioInUse) {
            this.closeRadioInterface();
        }

        if (!hasRadio) {
            this.store.dispatch.radioShortRange.enable(false);
        }
    }

    @StateSelector(state => state.radioShortRange.enabled)
    public toggleRadio(enabled: boolean) {
        const radioShortRange = this.store.getState().radioShortRange;

        if (!enabled) {
            this.voipService.disconnectRadio(radioShortRange.primary.frequency);
            this.voipService.disconnectRadio(radioShortRange.secondary.frequency);

            return;
        }

        if (radioShortRange.primary.frequency > 0) {
            this.voipService.connectRadio(radioShortRange.primary.frequency);
        }

        if (radioShortRange.secondary.frequency > 0) {
            this.voipService.connectRadio(radioShortRange.secondary.frequency);
        }
    }

    @StateSelector(state => state.radioShortRange.primary.frequency)
    public updatePrimaryFrequency(frequency: number, previousFrequency: number) {
        const radioShortRange = this.store.getState().radioShortRange;

        if (!radioShortRange.enabled) {
            return;
        }

        if (previousFrequency > 0) {
            this.voipService.disconnectRadio(previousFrequency);
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(frequency);
        }
    }

    @StateSelector(state => state.radioShortRange.secondary.frequency)
    public updateSecondaryFrequency(frequency: number, previousFrequency: number) {
        const radioShortRange = this.store.getState().radioShortRange;

        if (!radioShortRange.enabled) {
            return;
        }

        if (previousFrequency > 0) {
            this.voipService.disconnectRadio(previousFrequency);
        }

        if (frequency >= 0) {
            this.voipService.connectRadio(frequency);
        }
    }

    @StateSelector(state => state.radioShortRange)
    public updateRadioShortRange(radioShortRange: Radio) {
        this.nuiDispatch.dispatch('radio', 'Update', {
            ...radioShortRange,
            primaryClickVolume: this.voipService.getVoiceClickVolume(
                RadioType.RadioShortRange,
                RadioChannelType.Primary
            ),
            secondaryClickVolume: this.voipService.getVoiceClickVolume(
                RadioType.RadioShortRange,
                RadioChannelType.Secondary
            ),
        });
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

    @OnNuiEvent(NuiEvent.VoipUpdateRadioVolumeClick)
    public async onUpdateRadioVolumeClick({ volume, type }: { volume: number; type: RadioChannelType }) {
        this.voipService.setVoiceClickVolume(RadioType.RadioShortRange, type, volume);
        this.soundService.play(RadioType.RadioShortRange + '/mic_click_on', volume / 100);

        this.nuiDispatch.dispatch('radio', 'Update', {
            ...this.store.getState().radioShortRange,
            primaryClickVolume: this.voipService.getVoiceClickVolume(
                RadioType.RadioShortRange,
                RadioChannelType.Primary
            ),
            secondaryClickVolume: this.voipService.getVoiceClickVolume(
                RadioType.RadioShortRange,
                RadioChannelType.Secondary
            ),
        });
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
            const playerState = this.playerService.getState();
            if (!IsNuiFocused() && !playerState.carryBox && !playerState.isInventoryBusy) {
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

        const hasRadio = this.inventoryManager.hasEnoughItem('radio', 1, true);

        if (!hasRadio) {
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
                    model: 'soz_hand_radio',
                    bone: 57005,
                    position: [0.14, 0.03, -0.04],
                    rotation: [90.0, -15.0, 120.0],
                },
            ],
        });

        this.nuiDispatch.dispatch('radio', 'Open', {
            ...this.store.getState().radioShortRange,
            primaryClickVolume: this.voipService.getVoiceClickVolume(
                RadioType.RadioShortRange,
                RadioChannelType.Primary
            ),
            secondaryClickVolume: this.voipService.getVoiceClickVolume(
                RadioType.RadioShortRange,
                RadioChannelType.Secondary
            ),
        });
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
