import { Once, OnceStep } from '@public/core/decorators/event';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';

import { Inject } from '../../../core/decorators/injectable';
import { Tick } from '../../../core/decorators/tick';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { VoipService } from '../voip.service';
import { VoiceListeningService } from './voice.listening.service';
import { VoiceTargetService } from './voice.target.service';

const VOICE_TARGET = 1;

@Provider()
export class VoiceProvider {
    @Inject(VoiceListeningService)
    private voiceListeningService: VoiceListeningService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(VoiceTargetService)
    private voiceTargetService: VoiceTargetService;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private isConnecting = false;

    public intent: 'speech' | 'music' = 'speech';

    @Once(OnceStep.PlayerLoaded)
    public async initVoice(): Promise<void> {
        await this.reconnect();

        this.voiceListeningService.createAudioSubmixes();
        this.voipService.setReady(true);
    }

    public setIntent(intent: string): void {
        if (intent === 'speech' || intent === 'music') {
            this.intent = intent;
        }

        MumbleSetAudioInputIntent(this.intent);
    }

    @Tick(1000)
    public async checkConnection(): Promise<void> {
        if (!this.voipService.isReady() || this.isConnecting) {
            return;
        }

        if (MumbleIsConnected() === false) {
            await this.reconnect(true, 'Connexion perdue');
        } else {
            // We need to refresh voice target, as an user can disconnect and have a different session_id so we refresh target to be sure it's correct
            this.voiceTargetService.refresh();
        }
    }

    public async reconnect(notify = false, reason = ''): Promise<void> {
        if (this.isConnecting) {
            return;
        }

        try {
            this.isConnecting = true;

            MumbleSetActive(false);

            while (MumbleIsConnected() === true) {
                await wait(0);
            }

            this.nuiDispatch.dispatch('hud', 'UpdateVoiceActive', false);

            if (notify) {
                this.monitor.traceEvent('voip_restart', {
                    reason,
                });

                this.notifier.notify('Arret de la voip...');
            }

            const serverAddress = GetConvar('soz_voip_mumble_address', '');
            const serverPort = GetConvarInt('soz_voip_mumble_port', 64738);

            if (serverAddress.length !== 0) {
                MumbleSetServerAddress(serverAddress, serverPort);
            }

            MumbleSetAudioInputIntent(this.intent);
            MumbleSetActive(true);

            while (MumbleIsConnected() === false) {
                await wait(0);
            }

            MumbleSetVoiceTarget(VOICE_TARGET);

            if (notify) {
                this.notifier.notify('Voip réactivée.');
            }

            this.nuiDispatch.dispatch('hud', 'UpdateVoiceActive', true);

            this.voiceTargetService.refresh();
            this.voipService.resetVoiceMode();
        } finally {
            this.isConnecting = false;
        }
    }
}
