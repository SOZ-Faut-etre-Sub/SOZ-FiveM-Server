import data from '@emoji-mart/data/sets/14/apple.json';
import Picker from '@emoji-mart/react';
import { EmojiHappyIcon, PaperClipIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import qs from 'qs';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { useInterval } from '../../../../../hook/useInterval';
import SendIcon from '../../../assets/send.svg';
import { TextareaField } from '../../../components/Input';
import { useActionSheet } from '../../../system/action-sheet/hooks/useActionSheet';
import { useDarkWebAPI } from '../hooks/useDarkwebApi';

interface IProps {
    blockTime: number;
    darkwebConversationId: number | undefined;
    autoFocus?: boolean;
}

const DarkWebInput: FunctionComponent<IProps> = ({ darkwebConversationId, autoFocus, blockTime }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { pathname, search } = useLocation();

    const { openActionSheet, closeActionSheet } = useActionSheet();

    const [message, setMessage] = useState('');
    const [emojiKeyboard, setEmojiKeyboard] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [localBlockTime, setLocalBlockTime] = useState(0);

    const { sendMessage } = useDarkWebAPI();

    useInterval(() => {
        setBlocked(Date.now() < blockTime || Date.now() < localBlockTime);
    }, 500);

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

    const handleSendOptions = () => {
        openActionSheet('Envoyer', [
            {
                key: 'position',
                label: t('MESSAGES.POSITION_OPTION'),
                onClick: async () => {
                    const position = await fetchNui<null, string[]>(NuiEvent.GetPlayerPosition);

                    sendMessage({
                        conversationId: darkwebConversationId,
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
                        conversationId: darkwebConversationId,
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

    useEffect(() => {
        return () => closeActionSheet();
    }, []);

    if (!darkwebConversationId) return null;

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
                        searchPosition="none"
                        className="w-full"
                    />
                </div>
            )}
            <button onClick={handleSendOptions} disabled={blocked}>
                <PaperClipIcon
                    className={clsx('h-5 w-5 mx-2', {
                        'text-teal-500 hover:text-teal-400': !blocked,
                        'text-teal-900 hover:text-teal-900': blocked,
                    })}
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
