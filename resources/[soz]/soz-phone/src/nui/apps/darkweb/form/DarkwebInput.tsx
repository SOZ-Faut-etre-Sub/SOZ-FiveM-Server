import data from '@emoji-mart/data/sets/14/apple.json';
import Picker from '@emoji-mart/react';
import { EmojiHappyIcon, PaperClipIcon } from '@heroicons/react/outline';
import { SendIcon } from '@ui/assets/send';
import { TextareaField } from '@ui/old_components/Input';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useInterval from '../../../hooks/useInterval';
import { UseDarkwebAPI } from '../hooks/useDarkwebApi';

interface IProps {
    onAddImageClick(): void;
    blockTime: number;
    darkwebConversationId: number | undefined;
    autoFocus?: boolean;
}

const DarkWebInput: FunctionComponent<IProps> = ({ darkwebConversationId, onAddImageClick, autoFocus, blockTime }) => {
    const [t] = useTranslation();
    const [message, setMessage] = useState('');
    const [emojiKeyboard, setEmojiKeyboard] = useState(false);
    const { sendMessage } = UseDarkwebAPI();
    const [blocked, setBlocked] = useState(false);
    const [localBlockTime, setLocalBlockTime] = useState(0);

    useInterval(
        () => {
            setBlocked(Date.now() < blockTime || Date.now() < localBlockTime);
        },
        500,
        [blockTime, localBlockTime]
    );

    const handleSubmit = async () => {
        if (message.trim()) {
            setEmojiKeyboard(false);
            setLocalBlockTime(Date.now() + 1_000);
            setBlocked(true);
            await sendMessage({ conversationId: darkwebConversationId, message });
            setMessage('');
        }
    };

    const handleKeyPress = async (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey && !blocked) {
            event.preventDefault();
            await handleSubmit();
        }
    };

    const handleEmojiAppend = async (emojiData: { shortcodes: string }) => {
        setMessage(prev => prev + emojiData.shortcodes + ' ');
    };

    if (!darkwebConversationId) return null;

    return (
        <div className="flex h-14 mt-1 items-center">
            {emojiKeyboard && (
                <div className="absolute w-full z-10 bottom-[150px] left-[25px] right-0 opacity-90">
                    <Picker
                        data={data}
                        set="apple"
                        onEmojiSelect={handleEmojiAppend}
                        navPosition="bottom"
                        previewPosition="none"
                        searchPosition="none"
                        className="w-full"
                    />
                </div>
            )}
            <button onClick={onAddImageClick} disabled={blocked}>
                <PaperClipIcon
                    className={`h-5 w-5 mx-2 ${
                        !blocked ? 'text-teal-500 hover:text-teal-400' : 'text-teal-900 hover:text-teal-900'
                    }`}
                />
            </button>
            <button onClick={() => setEmojiKeyboard(s => !s)}>
                <EmojiHappyIcon className={'h-5 w-5 mx-2 text-teal-500 hover:text-teal-400'} />
            </button>
            <TextareaField
                className={'bg-black/20 border-2 border-teal-500 text-teal-500 placeholder:text-teal-800'}
                onKeyPress={handleKeyPress}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('MESSAGES.NEW_MESSAGE')}
                autoFocus={autoFocus}
            />
            <button
                disabled={blocked}
                className={`rounded-full h-10 w-10 mx-2 flex align-center justify-center shrink border-2 ${
                    !blocked ? 'border-teal-500 hover:bg-teal-900/50' : 'border-teal-900'
                }`}
                onClick={handleSubmit}
            >
                <SendIcon
                    className={`w-5 h-5 m-2 pt-0.5 ${
                        !blocked ? 'text-teal-500 hover:bg-teal-900/50' : 'text-teal-900'
                    } -rotate-45`}
                />
            </button>
        </div>
    );
};

export default DarkWebInput;
