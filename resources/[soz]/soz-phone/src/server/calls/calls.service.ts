import Collection from '@discordjs/collection';
import { v4 as uuidv4 } from 'uuid';

import {
    ActiveCall,
    ActiveCallRaw,
    CallEvents,
    CallHistoryItem,
    EndCallDTO,
    InitializeCallDTO,
    MuteCallDTO,
} from '../../../typings/call';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import { mainLogger } from '../sv_logger';
import { emitNetTyped } from '../utils/miscUtils';
import CallsDB, { CallsRepo } from './calls.db';
import { callLogger } from './calls.utils';

class CallsService {
    private callMap: Collection<string, ActiveCallRaw>;
    private readonly callsDB: CallsRepo;

    constructor() {
        this.callMap = new Collection();
        this.callsDB = CallsDB;
        callLogger.debug('Call service started');
    }

    private setCallInMap(transmitterNumber: string, callObj: ActiveCallRaw): void {
        this.callMap.set(transmitterNumber, callObj);
        callLogger.debug(`Call obj set with key ${transmitterNumber}, value:`);
        callLogger.debug(callObj);
    }

    async handleInitializeCall(
        reqObj: PromiseRequest<InitializeCallDTO>,
        resp: PromiseEventResp<ActiveCall>
    ): Promise<void> {
        // Create initial call data
        const transmittingPlayer = PlayerService.getPlayer(reqObj.source);
        const transmitterNumber = transmittingPlayer.getPhoneNumber();
        const receiverIdentifier = await PlayerService.getIdentifierFromPhoneNumber(reqObj.data.receiverNumber, true);

        // If not online we immediately let the caller know that is an invalid
        // number
        if (!receiverIdentifier) {
            return resp({
                status: 'error',
                data: {
                    transmitter: transmitterNumber,
                    isTransmitter: true,
                    receiver: reqObj.data.receiverNumber,
                    isUnavailable: true,
                    is_accepted: false,
                },
            });
        }

        const callIdentifier = uuidv4();

        // Will be null if the player is offline
        const receivingPlayer = PlayerService.getPlayerFromIdentifier(receiverIdentifier);

        const callObj: ActiveCallRaw = {
            identifier: callIdentifier,
            transmitter: transmitterNumber,
            transmitterSource: transmittingPlayer.source,
            receiver: reqObj.data.receiverNumber,
            receiverSource: receivingPlayer?.source || 0,
            start: new Date().getTime() / 1000,
            end: new Date().getTime() / 1000,
            is_accepted: false,
        };

        // Now we can add the call to our memory map
        this.setCallInMap(callObj.transmitter, callObj);

        try {
            await this.callsDB.saveCall(callObj);
        } catch (e) {
            callLogger.error(
                `Unable to save call object for transmitter number ${transmitterNumber}. Error: ${e.toString()}`
            );
            resp({ status: 'error', errorMsg: 'DATABASE_ERROR' });
        }

        // Now if the player is offline, we send the same resp
        // as before
        if (!receivingPlayer) {
            emitNet(CallEvents.ADD_CALL, reqObj.source, {
                is_accepted: false,
                transmitter: transmitterNumber,
                receiver: reqObj.data.receiverNumber,
                isTransmitter: true,
            });

            return resp({
                status: 'ok',
                data: {
                    is_accepted: false,
                    transmitter: transmitterNumber,
                    isTransmitter: true,
                    receiver: reqObj.data.receiverNumber,
                    isUnavailable: true,
                },
            });
        }

        // At this point we return back to the client that the player contacted
        // is technically available and therefore intialization process ic omplete
        resp({
            status: 'ok',
            data: {
                is_accepted: false,
                transmitter: transmitterNumber,
                receiver: reqObj.data.receiverNumber,
                isTransmitter: true,
            },
        });

        emitNetTyped<ActiveCall>(
            CallEvents.START_CALL,
            {
                is_accepted: false,
                transmitter: transmitterNumber,
                receiver: reqObj.data.receiverNumber,
                isTransmitter: false,
            },
            receivingPlayer.source
        );

        emitNet(CallEvents.ADD_CALL, reqObj.source, {
            is_accepted: false,
            transmitter: transmitterNumber,
            receiver: reqObj.data.receiverNumber,
            isTransmitter: true,
        });

        emitNet(CallEvents.ADD_CALL, receivingPlayer.source, {
            is_accepted: false,
            transmitter: transmitterNumber,
            receiver: reqObj.data.receiverNumber,
            isTransmitter: false,
        });
    }

    async handleAcceptCall(src: number, transmitterNumber: string): Promise<void> {
        // We retrieve the call that was accepted from the current calls map
        const targetCallItem = this.callMap.get(transmitterNumber);
        // We update its reference
        targetCallItem.is_accepted = true;

        const channelId = src;

        await this.callsDB.updateCall(targetCallItem, true);
        callLogger.debug(`Call with key ${transmitterNumber} was updated to be accepted`);

        // player who is being called
        if (targetCallItem.receiverSource !== 0) {
            emitNetTyped<ActiveCall>(
                CallEvents.WAS_ACCEPTED,
                {
                    is_accepted: true,
                    transmitter: transmitterNumber,
                    receiver: targetCallItem.receiver,
                    isTransmitter: false,
                    channelId,
                    startedAt: new Date().getTime() / 1000,
                },
                targetCallItem.receiverSource
            );
        }

        mainLogger.debug(targetCallItem);

        // player who is calling
        emitNetTyped<ActiveCall>(
            CallEvents.WAS_ACCEPTED,
            {
                is_accepted: true,
                transmitter: transmitterNumber,
                receiver: targetCallItem.receiver,
                isTransmitter: true,
                channelId,
                startedAt: new Date().getTime() / 1000,
            },
            targetCallItem.transmitterSource
        );

        emitNet(CallEvents.UPDATE_CALL, targetCallItem.receiverSource, {
            is_accepted: true,
            transmitter: transmitterNumber,
            receiver: targetCallItem.receiver,
            isTransmitter: false,
            channelId,
            startedAt: new Date().getTime() / 1000,
        });

        emitNet(CallEvents.UPDATE_CALL, targetCallItem.transmitterSource, {
            is_accepted: true,
            transmitter: transmitterNumber,
            receiver: targetCallItem.receiver,
            isTransmitter: true,
            channelId,
            startedAt: new Date().getTime() / 1000,
        });
    }

    async handleMuteCall(src: number, data: MuteCallDTO): Promise<void> {
        const targetCallItem = this.callMap.get(data.transmitterNumber);

        emitNet(
            'voip:client:call:setMute',
            data.isTransmitter ? targetCallItem.receiverSource : targetCallItem.transmitterSource,
            data.muted
        );
    }

    async handleFetchCalls(reqObj: PromiseRequest<void>, resp: PromiseEventResp<CallHistoryItem[]>): Promise<void> {
        const player = PlayerService.getPlayer(reqObj.source);
        const srcPlayerNumber = player.getPhoneNumber();

        try {
            const calls = await this.callsDB.fetchCalls(srcPlayerNumber);
            resp({ status: 'ok', data: calls });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DATABASE_ERROR' });
            callLogger.error(`Error while fetching calls, ${e.toString()}`);
        }
    }

    async handleRejectCall(src: number, transmitterNumber: string): Promise<void> {
        const currentCall = this.callMap.get(transmitterNumber);

        if (!currentCall) {
            callLogger.error(`Call with transmitter number ${transmitterNumber} does not exist in current calls map!`);
            return;
        }

        // player who is calling and recieved the rejection.
        emitNet(CallEvents.WAS_REJECTED, currentCall.transmitterSource);
        emitNet(CallEvents.WAS_REJECTED, currentCall.receiverSource);

        // Update our database
        await this.callsDB.updateCall(currentCall, false);

        // Remove from active memory map
        this.callMap.delete(transmitterNumber);
    }

    isPlayerAlreadyInCall(phone: string): boolean {
        return (
            this.callMap.find(call => (call.transmitter === phone || call.receiver === phone) && call.is_accepted) !==
            undefined
        );
    }

    async handleEndCall(reqObj: PromiseRequest<EndCallDTO>, resp: PromiseEventResp<void>) {
        const transmitterNumber = reqObj.data.transmitterNumber;
        const currentCall = this.callMap.get(transmitterNumber);
        const transmitterCall = this.callMap.get(currentCall?.transmitter);

        if (!currentCall) {
            callLogger.error(`Call with transmitter number ${transmitterNumber} does not exist in current calls map!`);
            return resp({ status: 'error', errorMsg: 'DOES_NOT_EXIST' });
        }

        // Just in case currentCall for some reason at this point is falsy
        // lets protect against that
        if (currentCall) {
            emitNet(CallEvents.WAS_ENDED, currentCall.transmitterSource);
            if (
                (currentCall.receiverSource !== 0 &&
                    currentCall?.identifier === transmitterCall?.identifier &&
                    currentCall?.is_accepted) ||
                (currentCall?.identifier === transmitterCall?.identifier &&
                    currentCall?.is_accepted === false &&
                    !this.isPlayerAlreadyInCall(transmitterCall?.receiver))
            ) {
                emitNet(CallEvents.WAS_ENDED, currentCall.receiverSource);
            }
        }
        // player who is calling (transmitter)
        resp({ status: 'ok' });

        await this.callsDB.updateCall(currentCall, currentCall?.is_accepted);
        // Clear from memory
        this.callMap.delete(transmitterNumber);
    }
}

export default new CallsService();
