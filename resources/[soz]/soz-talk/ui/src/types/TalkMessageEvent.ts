import {Ear} from "./RadioScreen";

export type TalkMessageType = 'radio' | 'cibi'
export type TalkMessageAction = 'open' | 'close' | 'enabled' | 'frequency_change' | 'volume_change' | 'ear_change'

export interface TalkMessageData {
    type: TalkMessageType
    action: TalkMessageAction
    frequency?: number
    volume?: number
    ear?: Ear
    isPrimary?: boolean
    isEnabled?: boolean
}

