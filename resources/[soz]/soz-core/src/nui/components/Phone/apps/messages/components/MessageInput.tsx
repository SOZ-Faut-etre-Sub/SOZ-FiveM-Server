import data from '@emoji-mart/data/sets/15/apple.json';
import Picker from '@emoji-mart/react';
import { EmojiHappyIcon, PaperClipIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import qs from 'qs';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import SendIcon from '../../../assets/send.svg';
import { TextareaField } from '../../../components/Input';
import { useActionSheet } from '../../../system/action-sheet/hooks/useActionSheet';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useMessageAPI } from '../hooks/useMessageAPI';

interface MessageInputProps {
    messageConversationId: string | undefined;
    autoFocus?: boolean;
}

export const MessageInput: FunctionComponent<MessageInputProps> = ({ messageConversationId, autoFocus }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    const theme = useThemeConfig();

    const { openActionSheet } = useActionSheet();

    const [message, setMessage] = useState('');
    const [emojiKeyboard, setEmojiKeyboard] = useState(false);
    const { sendMessage } = useMessageAPI();

    const handleSubmit = async () => {
        if (message.trim()) {
            setEmojiKeyboard(false);
            sendMessage({ conversation_id: messageConversationId, message });
            setMessage('');
        }
    };

    const handleKeyPress = async (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await handleSubmit();
        }
    };

    const handleEmojiAppend = async (emojiData: { shortcodes: string }) => {
        setMessage(prev => prev + emojiData.shortcodes + ' ');
    };

    const handleSendOptions = () => {
        openActionSheet('Envoyer', [
            {
                key: 'position',
                label: t('MESSAGES.POSITION_OPTION'),
                onClick: async () => {
                    const position = await fetchNui<null, string[]>(NuiEvent.GetPlayerPosition);

                    sendMessage({
                        conversation_id: messageConversationId,
                        message: `vec3(${position.join(',')})`,
                    });
                },
            },
            {
                key: 'destination',
                label: t('MESSAGES.DESTINATION_OPTION'),
                onClick: async () => {
                    const position = await fetchNui<null, string[]>(NuiEvent.GetWaypoint);

                    sendMessage({
                        conversation_id: messageConversationId,
                        message: `vec3(${position.join(',')})`,
                    });
                },
            },
            {
                key: 'photo',
                label: t('MESSAGES.MEDIA_OPTION'),
                onClick: () => {
                    navigate(
                        `/photos?${qs.stringify({
                            referral: encodeURIComponent(pathname + search),
                        })}`
                    );
                },
            },
        ]);
    };

    if (!messageConversationId) return null;

    return (
        <div className="flex h-14 mt-1 items-center">
            {emojiKeyboard && (
                <div className="absolute z-10 bottom-[100px] inset-x-[25px] opacity-90">
                    <Picker
                        data={data}
                        set="apple"
                        onEmojiSelect={handleEmojiAppend}
                        navPosition="bottom"
                        previewPosition="none"
                        searchPosition="sticky"
                    />
                </div>
            )}

            <button onClick={handleSendOptions}>
                <PaperClipIcon
                    className={clsx('h-5 w-5 mx-2', {
                        'text-white': theme === 'dark',
                        'text-black': theme === 'light',
                    })}
                />
            </button>
            <button onClick={() => setEmojiKeyboard(s => !s)}>
                <EmojiHappyIcon
                    className={clsx('h-5 w-5 mx-2', {
                        'text-white': theme === 'dark',
                        'text-black': theme === 'light',
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
