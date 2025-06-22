import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Tick } from '../../../core/decorators/tick';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { getChunkId, getGridChunks } from '../../../shared/grid';
import { Vector3 } from '../../../shared/polyzone/vector';
import { RpcServerEvent } from '../../../shared/rpc';
import { VoiceListeningService } from './voice.listening.service';
import { VoiceTargetService } from './voice.target.service';

const VOIP_RADIUS = 128; // 128 meters

@Provider()
export class VoiceProximityProvider {
    @Inject(VoiceTargetService)
    private voiceTargetService: VoiceTargetService;

    @Inject(VoiceListeningService)
    private voiceListeningService: VoiceListeningService;

    private megaPhonePlayers = new Set<number>();

    private currentChunks: Set<number> = new Set();

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        const megaphonePlayers = await emitRpc<number[]>(RpcServerEvent.VOIP_GET_MEGAPHONE_PLAYERS);

        for (const player of megaphonePlayers) {
            this.megaPhonePlayers.add(player);

            this.voiceListeningService.addPlayerAudioContext(player, 'megaphone', {
                type: 'megaphone',
                priority: 4,
            });
        }
    }

    @OnEvent(ClientEvent.VOIP_SET_MEGAPHONE)
    public onSetMegaphone(player: number, state: boolean) {
        if (state) {
            this.megaPhonePlayers.add(player);
            this.voiceListeningService.addPlayerAudioContext(player, 'megaphone', {
                type: 'megaphone',
                priority: 4,
            });
        } else {
            this.megaPhonePlayers.delete(player);
            this.voiceListeningService.removePlayerAudioContext(player, 'megaphone');
        }
    }

    @Tick(1000)
    public async checkVoiceGridChunks() {
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const newChunks = getGridChunks(position, VOIP_RADIUS);

        const currentChunkId = getChunkId(position, VOIP_RADIUS);
        const diffAdded = newChunks.filter(chunk => !this.currentChunks.has(chunk));
        const diffRemoved = Array.from(this.currentChunks).filter(chunk => !newChunks.includes(chunk));

        for (const id of diffAdded) {
            this.currentChunks.add(id);
            this.voiceTargetService.addChannel(id);
        }

        for (const id of diffRemoved) {
            this.currentChunks.delete(id);
            this.voiceTargetService.removeChannel(id);
        }

        this.voiceListeningService.setListeningChannel(currentChunkId);
    }
}
