import { PaperClipIcon, UploadIcon } from '@heroicons/react/outline';
import { TextField } from '@ui/components/Input';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '../../../../styles/themeProvider';
import { useMessageAPI } from '../../hooks/useMessageAPI';

interface IProps {
    onAddImageClick(): void;

    messageConversationId: string | undefined;
    messageGroupName: string | undefined;
}

const MessageInput = ({ messageConversationId, onAddImageClick }: IProps) => {
    const [t] = useTranslation();
    const { theme } = useContext(ThemeContext);
    const [message, setMessage] = useState('');
    const { sendMessage } = useMessageAPI();

    const handleSubmit = async () => {
        if (message.trim()) {
            await sendMessage({ conversationId: messageConversationId, message });
            setMessage('');
        }
    };

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            await handleSubmit();
        }
    };

    if (!messageConversationId) return null;

    return (
        <div className="flex">
            <button onClick={onAddImageClick}>
                <PaperClipIcon className={`h-5 w-5 mx-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            </button>
            <TextField
                onKeyPress={handleKeyPress}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('MESSAGES.NEW_MESSAGE')}
            />
            <button className="bg-[#32CA5B] rounded-full mx-2 " onClick={handleSubmit}>
                <UploadIcon className="w-5 h-5 mx-2 text-white" />
            </button>
        </div>
    );
};

export default MessageInput;
