export interface ActiveCall {
    is_accepted: boolean;
    isTransmitter: boolean;
    transmitter: string;
    receiver: string;
    channelId?: number;
    isUnavailable?: boolean;
    startedAt?: number;
}

export interface InitializeCallDTO {
    receiverNumber: string;
}

export interface StartCallEventData {
    transmitter: string;
    receiver: string;
    isTransmitter: boolean;
    isUnavailable?: boolean;
}

export interface EndCallDTO {
    transmitterNumber: string;
    isTransmitter: boolean;
}

export interface TransmitterNumDTO {
    transmitterNumber: string;
}

export interface CallWasAcceptedEvent {
    channelId: number;
    currentCall: CallHistoryItem;
    isTransmitter: boolean;
}

export interface ActiveCallRaw {
    identifier: string;
    transmitter: string;
    transmitterSource: number;
    receiver: string;
    receiverSource: number;
    start: string;
    is_accepted: boolean;
}

export interface CallHistoryItem {
    id?: number;
    identifier: string;
    transmitter: string;
    transmitterSource?: number;
    receiver: string;
    receiverSource?: number;
    start: string;
    end?: number;
    is_accepted: boolean;
}

export enum CallRejectReasons {
    DECLINED,
    BUSY_LINE,
}

export enum CallEvents {
    INITIALIZE_CALL = 'phone:beginCall',
    START_CALL = 'phone:startCall',
    ACCEPT_CALL = 'phone:acceptCall',
    END_CALL = 'phone:endCall',
    WAS_ENDED = 'phone:callEnded',
    WAS_ACCEPTED = 'phone:callAccepted',
    REJECTED = 'phone:rejectCall',
    WAS_REJECTED = 'phone:callRejected',
    FETCH_CALLS = 'phone:fetchCalls',
    SET_CALLER = 'phone:setCaller',
    SET_CALL_MODAL = 'phone:callModal',
    SEND_ALERT = 'phone:callSetAlert',
}
