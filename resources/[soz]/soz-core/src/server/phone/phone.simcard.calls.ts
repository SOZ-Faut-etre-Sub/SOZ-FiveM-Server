import { Provider } from '@public/core/decorators/provider';
import { RpcServerEvent } from '@public/shared/rpc';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { uuidv4 } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { ActiveCall } from '../../shared/phone/simcard';
import { Err } from '../../shared/result';
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
            return;
        }

        const targetPlayer = this.playerService.getPlayerByPhone(phoneNumber);
        if (!targetPlayer) {
            console.error('Player not found for', phoneNumber);
            // todo: handle player is unnavailable or not found
            return 'unavailable';
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

        // todo: send notification to target player
        // if (!receivingPlayer) {
        //     return resp({
        //         status: 'ok',
        //         data: {
        //             is_accepted: false,
        //             transmitter: transmitterNumber,
        //             isTransmitter: true,
        //             receiver: reqObj.data.receiverNumber,
        //             isUnavailable: true,
        //         },
        //     });
        // }

        // At this point we return back to the client that the player contacted
        // is technically available and therefore intialization process ic omplete
        // resp({
        //     status: 'ok',
        //     data: {
        //         is_accepted: false,
        //         transmitter: transmitterNumber,
        //         receiver: reqObj.data.receiverNumber,
        //         isTransmitter: true,
        //     },
        // });

        this.sendCallDataToClients(currentCall);

        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_INIT, currentCall.transmitterSource);
        TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_RECEIVE, currentCall.receiverSource);
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

        this.calls.delete(phoneNumber);
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CALLS_END)
    async endCall(source: number, phoneNumber: string) {
        const currentCall = this.calls.get(phoneNumber);
        if (!currentCall) {
            console.error('Call not found in active calls map for', phoneNumber);
            return Err('Call not found');
        }

        const transmitterCall = this.calls.get(currentCall?.transmitter);

        await this.prismaService.phone_calls.updateMany({
            where: { identifier: currentCall.identifier },
            data: { end: new Date() },
        });

        if (currentCall.transmitterSource !== null) {
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, currentCall.transmitterSource, null);
        }

        if (
            currentCall.receiverSource !== null &&
            currentCall.receiverSource !== 0 &&
            currentCall?.identifier === transmitterCall?.identifier &&
            (currentCall?.is_accepted || !this.isReceiverIsBusy(transmitterCall?.receiver))
        ) {
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE, currentCall.receiverSource, null);
        }

        if (currentCall.is_accepted) {
            TriggerEvent(ServerEvent.VOIP_PHONE_CALL_END, source);
        }

        this.calls.delete(phoneNumber);
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
    }
}
