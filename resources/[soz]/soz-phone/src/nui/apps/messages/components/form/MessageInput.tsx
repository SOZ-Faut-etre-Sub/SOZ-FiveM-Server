import i18n from '@emoji-mart/data/i18n/fr.json';
import data from '@emoji-mart/data/sets/14/apple.json';
import Picker from '@emoji-mart/react';
import { EmojiHappyIcon, PaperClipIcon } from '@heroicons/react/outline';
import cn from 'classnames';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../../../hooks/usePhone';
import { SendIcon } from '../../../../ui/assets/send';
import { TextareaField, toggleKeys } from '../../../../ui/old_components/Input';
import { useMessageAPI } from '../../hooks/useMessageAPI';

interface IProps {
    onAddImageClick(): void;

    messageConversationId: string | undefined;
    messageGroupName: string | undefined;
    autoFocus?: boolean;
}

const MessageInput: FunctionComponent<IProps> = ({ messageConversationId, onAddImageClick, autoFocus }) => {
    const [t] = useTranslation();
    const config = useConfig();
    const [message, setMessage] = useState('');
    const [emojiKeyboard, setEmojiKeyboard] = useState(false);
    const { sendMessage } = useMessageAPI();
    const [intermediaryFocus, setIntermediaryFocus] = useState<boolean>(true);

    const handleSubmit = async () => {
        if (message.trim()) {
            setEmojiKeyboard(false);
            await sendMessage({ conversationId: messageConversationId, message });
            setMessage('');
        }
    };

    const handleKeyPress = async (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await handleSubmit();
        }
    };

    useEffect(() => {
        toggleKeys(intermediaryFocus);
    }, [intermediaryFocus]);

    addEventListener('beforeinput', event => {
        if (event?.path[0]?.computedRole === 'searchbox' && intermediaryFocus) {
            if (intermediaryFocus) {
                setIntermediaryFocus(false);
            }
        }
    });
    addEventListener('focusout', () => {
        if (!intermediaryFocus) {
            setIntermediaryFocus(true);
        }
    });

    const handleEmojiAppend = async (emojiData: { shortcodes: string }) => {
        setMessage(prev => prev + emojiData.shortcodes + ' ');
    };

    if (!messageConversationId) return null;
    return (
        <div className="flex h-14 mt-1 items-center">
            {emojiKeyboard && (
                <div className="absolute w-full z-10 bottom-[150px] left-[25px] right-0 opacity-90">
                    <Picker
                        id={'search-emoji-input'}
                        data={data}
                        set="apple"
                        onEmojiSelect={handleEmojiAppend}
                        navPosition="bottom"
                        previewPosition="none"
                        searchPosition="top"
                        className="w-full"
                        i18n={i18n}
                    />
                </div>
            )}
            <button onClick={onAddImageClick}>
                <PaperClipIcon
                    className={cn('h-5 w-5 mx-2', {
                        'text-white': config.theme.value === 'dark',
                        'text-black': config.theme.value === 'light',
                    })}
                />
            </button>
            <button onClick={() => setEmojiKeyboard(s => !s)}>
                <EmojiHappyIcon
                    className={cn('h-5 w-5 mx-2', {
                        'text-white': config.theme.value === 'dark',
                        'text-black': config.theme.value === 'light',
                    })}
                />
            </button>
            <TextareaField
                onKeyPress={handleKeyPress}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('MESSAGES.NEW_MESSAGE')}
                autoFocus={autoFocus}
            />
            <button
                className="bg-[#32CA5B] rounded-full h-10 w-10 mx-2 flex align-center justify-center shrink "
                onClick={handleSubmit}
            >
                <SendIcon className="w-5 h-5 m-2 pt-0.5 text-white -rotate-45" />
            </button>
        </div>
    );
};

export default MessageInput;
