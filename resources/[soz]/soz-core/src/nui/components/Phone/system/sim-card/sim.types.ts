export interface ActiveCall {
    is_accepted: boolean;
    isTransmitter: boolean;
    transmitter: string;
    receiver: string;
    channelId?: number;
    isUnavailable?: boolean;
    startedAt?: number;
    muted?: boolean;
}
