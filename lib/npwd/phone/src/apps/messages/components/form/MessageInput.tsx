import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextField} from '@ui/components/Input';
import {useMessageAPI} from '../../hooks/useMessageAPI';

interface IProps {
    onAddImageClick(): void;

    messageConversationId: string | undefined;
    messageGroupName: string | undefined;
}

const MessageInput = ({messageConversationId, onAddImageClick}: IProps) => {
    const [t] = useTranslation();
    const [message, setMessage] = useState('');
    const {sendMessage} = useMessageAPI();

    const handleSubmit = async () => {
        if (message.trim()) {
            await sendMessage({conversationId: messageConversationId, message});
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
        <div>
            <div>
                <button onClick={onAddImageClick}>
                    {/*<MenuIcon/>*/}
                </button>
            </div>
            <div>
                <TextField
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={4}
                    aria-multiline="true"
                    fullWidth
                    inputProps={{style: {fontSize: '1.3em'}}}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('MESSAGES.NEW_MESSAGE')}
                />
            </div>
            <div>
                <button onClick={handleSubmit}>
                    {/*<FileUploadIcon/>*/}
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
