import Collection from '@discordjs/collection';
import {
  CallEvents,
  CallHistoryItem,
  InitializeCallDTO,
  EndCallDTO,
  ActiveCall,
  ActiveCallRaw,
} from '../../../typings/call';
import CallsDB, { CallsRepo } from './calls.db';
import { v4 as uuidv4 } from 'uuid';
import PlayerService from '../players/player.service';
import { callLogger } from './calls.utils';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { emitNetTyped } from '../utils/miscUtils';
import { mainLogger } from '../sv_logger';

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
    resp: PromiseEventResp<ActiveCall>,
  ): Promise<void> {
    // Create initial call data
    const transmittingPlayer = PlayerService.getPlayer(reqObj.source);
    const transmitterNumber = transmittingPlayer.getPhoneNumber();
    const receiverIdentifier = await PlayerService.getIdentifierFromPhoneNumber(
      reqObj.data.receiverNumber,
      true,
    );

    // If not online we immediately let the caller know that is an invalid
    // number
    if (!receiverIdentifier) {
      return resp({
        status: 'ok',
        data: {
          transmitter: transmitterNumber,
          isTransmitter: true,
          receiver: reqObj.data.receiverNumber,
          isUnavailable: true,
          is_accepted: false,
        },
      });
    }

    const startCallTimeUnix = Math.floor(new Date().getTime() / 1000);
    const callIdentifier = uuidv4();

    // Will be null if the player is offline
    const receivingPlayer = PlayerService.getPlayerFromIdentifier(receiverIdentifier);

    // Now if the player is offline, we send the same resp
    // as before
    if (!receivingPlayer) {
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

    callLogger.debug(`Receiving Identifier: ${receiverIdentifier}`);
    callLogger.debug(`Receiving source: ${receivingPlayer.source} `);

    const callObj: ActiveCallRaw = {
      identifier: callIdentifier,
      transmitter: transmitterNumber,
      transmitterSource: transmittingPlayer.source,
      receiver: reqObj.data.receiverNumber,
      receiverSource: receivingPlayer.source,
      start: startCallTimeUnix.toString(),
      is_accepted: false,
    };

    // Now we can add the call to our memory map
    this.setCallInMap(callObj.transmitter, callObj);

    try {
      await this.callsDB.saveCall(callObj);
    } catch (e) {
      callLogger.error(
        `Unable to save call object for transmitter number ${transmitterNumber}. Error: ${e.message}`,
      );
      resp({ status: 'error', errorMsg: 'DATABASE_ERROR' });
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
      receivingPlayer.source,
    );
  }

  async handleAcceptCall(src: number, transmitterNumber: string): Promise<void> {
    // We retrieve the call that was accepted from the current calls map
    const targetCallItem = this.callMap.get(transmitterNumber);
    // We update its reference
    targetCallItem.is_accepted = true;

    const channelId = src;

    await this.callsDB.updateCall(targetCallItem, true, null);
    callLogger.debug(`Call with key ${transmitterNumber} was updated to be accepted`);

    // player who is being called
    emitNetTyped<ActiveCall>(
      CallEvents.WAS_ACCEPTED,
      {
        is_accepted: true,
        transmitter: transmitterNumber,
        receiver: targetCallItem.receiver,
        isTransmitter: false,
        channelId,
      },
      targetCallItem.receiverSource,
    );

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
      },
      targetCallItem.transmitterSource,
    );
  }

  async handleFetchCalls(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<CallHistoryItem[]>,
  ): Promise<void> {
    try {
      const player = PlayerService.getPlayer(reqObj.source);
      const srcPlayerNumber = player.getPhoneNumber();
      const calls = await this.callsDB.fetchCalls(srcPlayerNumber);
      resp({ status: 'ok', data: calls });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DATABASE_ERROR' });
      console.error(`Error while fetching calls, ${e.message}`);
    }
  }

  async handleRejectCall(src: number, transmitterNumber: string): Promise<void> {
    const currentCall = this.callMap.get(transmitterNumber);

    const endCallTimeUnix = Math.floor(new Date().getTime() / 1000);

    if (!currentCall) {
      callLogger.error(
        `Call with transmitter number ${transmitterNumber} does not exist in current calls map!`,
      );
      return;
    }

    // player who is calling and recieved the rejection.
    emitNet(CallEvents.WAS_REJECTED, currentCall.transmitterSource);
    emitNet(CallEvents.WAS_REJECTED, currentCall.receiverSource);

    // Update our database
    await this.callsDB.updateCall(currentCall, false, endCallTimeUnix);

    // Remove from active memory map
    this.callMap.delete(transmitterNumber);
  }

  async handleEndCall(reqObj: PromiseRequest<EndCallDTO>, resp: PromiseEventResp<void>) {
    const transmitterNumber = reqObj.data.transmitterNumber;
    const endCallTimeUnix = Math.floor(new Date().getTime() / 1000);

    const currentCall = this.callMap.get(transmitterNumber);

    if (!currentCall) {
      callLogger.error(
        `Call with transmitter number ${transmitterNumber} does not exist in current calls map!`,
      );
      return resp({ status: 'error', errorMsg: 'DOES_NOT_EXIST' });
    }

    // Just in case currentCall for some reason at this point is falsy
    // lets protect against that
    if (currentCall) {
      emitNet(CallEvents.WAS_ENDED, currentCall.receiverSource);
      emitNet(CallEvents.WAS_ENDED, currentCall.transmitterSource);
    }
    // player who is calling (transmitter)
    resp({ status: 'ok' });

    // We should be fine once here but sentry was acting up idk
    await this.callsDB.updateCall(currentCall, currentCall?.is_accepted, endCallTimeUnix);
    // Clear from memory
    this.callMap.delete(transmitterNumber);
  }
}

export default new CallsService();
