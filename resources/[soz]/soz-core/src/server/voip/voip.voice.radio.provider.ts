import { On, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { RadioChannelType, RadioType } from '../../shared/voip';
import { Store } from '../store/store';

const MIN_FREQUENCY = 10000;
const MAX_FREQUENCY = 99999;

@Provider()
export class VoipVoiceRadioProvider {
    @Inject('Store')
    private store: Store;

    private channels: Map<number, Set<number>> = new Map();

    @OnEvent(ServerEvent.VOIP_RADIO_JOIN_CHANNEL)
    public joinChannel(source: number, frequency: number) {
        if (frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) {
            return;
        }

        if (!this.channels.has(frequency)) {
            this.channels.set(frequency, new Set());
        }

        this.channels.get(frequency).add(source);
    }

    @OnEvent(ServerEvent.VOIP_RADIO_LEAVE_CHANNEL)
    public leaveChannel(source: number, frequency: number) {
        const channel = this.channels.get(frequency);

        if (!channel) {
            return;
        }

        channel.delete(source);

        if (channel.size === 0) {
            this.channels.delete(frequency);
        }
    }

    @Rpc(RpcServerEvent.VOIP_VOICE_START_TRANSMITTING)
    public async startTransmitting(
        source: number,
        frequency: number,
        radioType: RadioType,
        channelType: RadioChannelType,
        position: Vector3
    ) {
        const blackout = this.store.getState().global.blackout;
        const blackoutLevel = this.store.getState().global.blackoutLevel;

        if (blackout || blackoutLevel > 1) {
            return [];
        }

        const channel = this.channels.get(frequency);

        if (!channel) {
            return [];
        }

        const players = Array.from(channel);

        for (const player of players) {
            // Don't send to self
            if (player === source) {
                continue;
            }

            TriggerClientEvent(
                ClientEvent.VOIP_VOICE_RADIO_PLAYER_START_TRANSMITTING,
                player,
                source,
                frequency,
                radioType,
                channelType,
                position
            );
        }

        return players;
    }

    @Rpc(RpcServerEvent.VOIP_VOICE_STOP_TRANSMITTING)
    public async stopTransmitting(source: number, frequency: number) {
        const channel = this.channels.get(frequency);

        if (!channel) {
            return;
        }

        const players = Array.from(channel);

        for (const player of players) {
            // Don't send to self
            if (player === source) {
                continue;
            }

            TriggerClientEvent(ClientEvent.VOIP_VOICE_RADIO_PLAYER_STOP_TRANSMITTING, player, source, frequency);
        }
    }

    @On('playerDropped')
    public onPlayerDroppedRadio(source: number) {
        for (const [frequency, channel] of this.channels) {
            if (channel.has(source)) {
                channel.delete(source);

                if (channel.size === 0) {
                    this.channels.delete(frequency);
                }
            }
        }
    }
}
