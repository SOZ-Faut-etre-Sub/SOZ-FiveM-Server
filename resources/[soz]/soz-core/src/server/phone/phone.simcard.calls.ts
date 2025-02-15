import { Provider } from '@public/core/decorators/provider';
import { RpcServerEvent } from '@public/shared/rpc';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { uuidv4 } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { ActiveCall } from '../../shared/phone/simcard';
import { Err, Ok } from '../../shared/result';
import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';
import { Store } from '../store/store';

@Provider()
export class PhoneSimCardCalls {
    @Inject('Store')
    private store: Store;

    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    private calls = new Map<string, ActiveCall>();

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CALLS_INIT)
    async initCalls(source: number, phoneNumber: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            console.error('Player not found for', source);
            return Err('unavailable');
        }

        const targetPlayer = this.playerService.getPlayerByPhone(phoneNumber);
        if (!targetPlayer || this.playerAlreadyInCall(targetPlayer.source)) {
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, player.source, {
                identifier: uuidv4(),
                transmitter: player.charinfo.phone,
                transmitterSource: player.source,
                receiver: phoneNumber,
                receiverSource: player.source,
                start: Date.now(),
                end: Date.now(),
                is_accepted: false,
                isTransmitter: true,
            });
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_INIT, player.source);
            return Ok('unavailable');
        }

        this.calls.set(player.charinfo.phone, {
            identifier: uuidv4(),
            transmitter: player.charinfo.phone,
            transmitterSource: player.source,
            receiver: targetPlayer.charinfo.phone,
            receiverSource: targetPlayer.source,
            start: Date.now(),
            end: Date.now(),
            is_accepted: false,
        });

        const currentCall = this.calls.get(player.charinfo.phone);

        await this.prismaService.phone_calls.create({
            data: {
                identifier: currentCall.identifier,
                transmitter: player.charinfo.phone,
                receiver: targetPlayer.charinfo.phone,
                start: new Date(currentCall.start),
                end: new Date(currentCall.end),
                is_accepted: currentCall.is_accepted ? 1 : 0,
            },
        });

        this.sendCallDataToClients(currentCall);

        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_INIT, currentCall.transmitterSource);
        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_RECEIVE, currentCall.receiverSource);

        return Ok('success');
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CALLS_ACCEPT)
    async acceptCall(source: number, phoneNumber: string) {
        const currentCall = this.calls.get(phoneNumber);
        if (!currentCall) {
            console.error('Call not found in active calls map for', phoneNumber);
            return Err('Call not found');
        }

        const blackout = this.store.getState().global.blackout;
        const blackoutLevel = this.store.getState().global.blackoutLevel;

        if (blackout || blackoutLevel > 2) {
            return;
        }

        currentCall.is_accepted = true;

        await this.prismaService.phone_calls.updateMany({
            where: { identifier: currentCall.identifier },
            data: { is_accepted: 1 },
        });

        TriggerEvent(ServerEvent.VOIP_PHONE_CALL_START, currentCall.transmitter, currentCall.receiver);

        this.sendCallDataToClients(currentCall);
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CALLS_DECLINE)
    async declineCall(source: number, phoneNumber: string) {
        const currentCall = this.calls.get(phoneNumber);
        if (!currentCall) {
            console.error('Call not found in active calls map for', phoneNumber);
            return Err('Call not found');
        }

        await this.prismaService.phone_calls.updateMany({
            where: { identifier: currentCall.identifier },
            data: { is_accepted: 0, end: new Date() },
        });

        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, currentCall.transmitterSource, null);
        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, currentCall.receiverSource, null);

        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_HISTORY, currentCall.transmitterSource);
        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_HISTORY, currentCall.receiverSource);

        this.calls.delete(phoneNumber);
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CALLS_END)
    async endCall(source: number, phoneNumber: string) {
        const currentCall = this.calls.get(phoneNumber);
        if (!currentCall) {
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, source, null);
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_HISTORY, source);
            return Err('Call not found');
        }

        const transmitterCall = this.calls.get(currentCall?.transmitter);

        await this.prismaService.phone_calls.updateMany({
            where: { identifier: currentCall.identifier },
            data: { end: new Date() },
        });

        if (currentCall.transmitterSource !== null) {
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, currentCall.transmitterSource, null);
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_HISTORY, currentCall.transmitterSource);
        }

        if (
            currentCall.receiverSource !== null &&
            currentCall.receiverSource !== 0 &&
            currentCall?.identifier === transmitterCall?.identifier &&
            (currentCall?.is_accepted || !this.isReceiverIsBusy(transmitterCall?.receiver))
        ) {
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, currentCall.receiverSource, null);
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_HISTORY, currentCall.receiverSource);
        }

        if (currentCall.is_accepted) {
            TriggerEvent(ServerEvent.VOIP_PHONE_CALL_END, source);
        }

        this.calls.delete(phoneNumber);
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CALLS_MUTE)
    async muteCall(source: number, phoneNumber: string, muted: boolean) {
        const currentCall = this.calls.get(phoneNumber);
        if (!currentCall) {
            return Err('Call not found');
        }

        const isTransmitter = currentCall.transmitterSource === source;
        const targetSource = isTransmitter ? currentCall.receiverSource : currentCall.transmitterSource;

        TriggerClientEvent(ClientEvent.VOIP_VOICE_MUTE_CALL, targetSource, muted);
        TriggerEvent(ServerEvent.VOIP_PHONE_CALL_MUTED, source, muted);
    }

    private playerAlreadyInCall(source: number) {
        return Array.from(this.calls.values()).find(
            call => call.transmitterSource === source || call.receiverSource === source
        );
    }

    private isReceiverIsBusy(receiver: string) {
        return (
            Object.values(this.calls).find(
                call => (call.transmitter === receiver || call.receiver === receiver) && call.is_accepted
            ) !== undefined
        );
    }

    private sendCallDataToClients(call: ActiveCall) {
        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, call.transmitterSource, {
            ...call,
            isTransmitter: true,
        });
        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, call.receiverSource, {
            ...call,
            isTransmitter: false,
        });

        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_HISTORY, call.transmitterSource);
        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_HISTORY, call.receiverSource);
    }
}
