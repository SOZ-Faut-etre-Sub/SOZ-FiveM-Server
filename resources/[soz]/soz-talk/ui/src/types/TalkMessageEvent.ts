
export type TalkMessageType = 'radio' | 'sibie'
export type TalkMessageAction = 'open' | 'close'

export interface TalkMessageData {
    type: TalkMessageType
    action: TalkMessageAction
}

