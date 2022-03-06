
export type TalkMessageType = 'radio' | 'cibi'
export type TalkMessageAction = 'open' | 'close' | 'enabled' | 'frequency_change' | 'volume_change'

export interface TalkMessageData {
    type: TalkMessageType
    action: TalkMessageAction
    frequency?: number
    volume?: number
    isPrimary?: boolean
    isEnabled?: boolean
}

