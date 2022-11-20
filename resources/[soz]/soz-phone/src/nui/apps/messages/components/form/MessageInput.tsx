import data from '@emoji-mart/data/sets/14/apple.json';
import Picker from '@emoji-mart/react';
import { EmojiHappyIcon, PaperClipIcon, UploadIcon } from '@heroicons/react/outline';
import { TextField } from '@ui/old_components/Input';
import cn from 'classnames';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../../../hooks/usePhone';
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

    const handleSubmit = async () => {
        if (message.trim()) {
            setEmojiKeyboard(false);
            await sendMessage({ conversationId: messageConversationId, message });
            setMessage('');
        }
    };

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            await handleSubmit();
        }
    };

    const handleEmojiAppend = async (emojiData: { shortcodes: string }) => {
        setMessage(prev => prev + emojiData.shortcodes + ' ');
    };

    if (!messageConversationId) return null;

    return (
        <div className="flex">
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
            <TextField
                onKeyPress={handleKeyPress}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('MESSAGES.NEW_MESSAGE')}
                autoFocus={autoFocus}
            />
            <button className="bg-[#32CA5B] rounded-full mx-2 " onClick={handleSubmit}>
                <UploadIcon className="w-5 h-5 mx-2 text-white" />
            </button>
        </div>
    );
};

export default MessageInput;
