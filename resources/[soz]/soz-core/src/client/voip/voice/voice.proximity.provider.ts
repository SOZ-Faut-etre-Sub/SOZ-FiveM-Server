import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Tick } from '../../../core/decorators/tick';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { getDistance, Vector3 } from '../../../shared/polyzone/vector';
import { RpcServerEvent } from '../../../shared/rpc';
import { VoiceListeningService } from './voice.listening.service';
import { VoiceTargetService } from './voice.target.service';

@Provider()
export class VoiceProximityProvider {
    @Inject(VoiceTargetService)
    private voiceTargetService: VoiceTargetService;

    @Inject(VoiceListeningService)
    private voiceListeningService: VoiceListeningService;

    private megaPhonePlayers = new Set<number>();
    private robotPlayers = new Set<number>();

    private currentProximityPlayers = new Set<number>();
    private knownPlayers = new Map<
        number,
        {
            ped: number;
            serverId: number;
        }
    >();

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        const megaphonePlayers = await emitRpc<number[]>(RpcServerEvent.VOIP_GET_MEGAPHONE_PLAYERS);

        for (const player of megaphonePlayers) {
            this.megaPhonePlayers.add(player);
        }

        const robotPlayers = await emitRpc<number[]>(RpcServerEvent.VOIP_GET_ROBOT_PLAYERS);

        for (const player of robotPlayers) {
            this.robotPlayers.add(player);

            this.voiceListeningService.addPlayerAudioContext(player, 'eodrobot', {
                type: 'eodrobot',
                priority: 5,
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

    @OnEvent(ClientEvent.VOIP_SET_ROBOT)
    public onSetRobot(player: number, state: boolean) {
        if (state) {
            this.robotPlayers.add(player);
            this.voiceListeningService.addPlayerAudioContext(player, 'eodrobot', {
                type: 'eodrobot',
                priority: 5,
            });
        } else {
            this.robotPlayers.delete(player);
            this.voiceListeningService.removePlayerAudioContext(player, 'eodrobot');
        }
    }

    @Tick(5000)
    public listProximityPlayers() {
        this.knownPlayers.clear();
        const players = GetActivePlayers();
        const selfPlayerId = PlayerId();

        for (const player of players) {
            if (player === selfPlayerId) {
                continue;
            }
            const serverId = GetPlayerServerId(player);

            if (!serverId) {
                continue;
            }

            const playerPed = GetPlayerPed(player);
            this.knownPlayers.set(player, {
                ped: playerPed,
                serverId,
            });
        }
    }

    @Tick()
    public checkProximityPlayers() {
        const currentPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const newProximityPlayers = new Set<number>();

        for (const player of this.knownPlayers.values()) {
            const playerPosition = GetEntityCoords(player.ped, false) as Vector3;
            const distance = getDistance(currentPosition, playerPosition);

            if (distance > 50) {
                continue;
            }

            newProximityPlayers.add(player.serverId);
        }

        // get diff
        const leftPlayers = new Set([...this.currentProximityPlayers].filter(x => !newProximityPlayers.has(x)));
        const newPlayers = new Set([...newProximityPlayers].filter(x => !this.currentProximityPlayers.has(x)));

        // remove players from audio context
        for (const player of leftPlayers) {
            this.voiceListeningService.removePlayerAudioContext(player, 'proximity');
            this.voiceTargetService.removePlayer(player, 'proximity');

            if (this.megaPhonePlayers.has(player)) {
                this.voiceListeningService.removePlayerAudioContext(player, 'megaphone');
            }
        }

        // add players to audio context
        for (const player of newPlayers) {
            this.voiceListeningService.addPlayerAudioContext(player, 'proximity', {
                type: 'proximity',
                priority: 6,
            });
            this.voiceTargetService.addPlayer(player, 'proximity');

            if (this.megaPhonePlayers.has(player)) {
                this.voiceListeningService.addPlayerAudioContext(player, 'megaphone', {
                    type: 'megaphone',
                    priority: 4,
                });
            } else {
                this.voiceListeningService.removePlayerAudioContext(player, 'megaphone');
            }
        }

        this.currentProximityPlayers = newProximityPlayers;
    }
}
