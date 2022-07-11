import { useQueryParams } from '@common/hooks/useQueryParams';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { Message, MessageConversation, MessageEvents } from '@typings/messages';
import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import { fetchNui } from '@utils/fetchNui';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useConversationId, useSetMessages } from '../../hooks/state';
import MessageInput from '../form/MessageInput';
import { MessageBubble } from './MessageBubble';
import { MessageImageModal } from './MessageImageModal';

interface IProps {
    activeMessageGroup: MessageConversation;
    messages: Message[];
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation: React.FC<IProps> = ({ activeMessageGroup, messages }) => {
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const query = useQueryParams();
    const referalImage = query?.image || null;
    const conversationId = useConversationId();
    const { addAlert } = useSnackbar();
    const navigate = useNavigate();
    const setMessages = useSetMessages();
    const [t] = useTranslation();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(!!messages.length);
    const { getContactByNumber } = useContactActions();

    const conversationContact = getContactByNumber(activeMessageGroup.phoneNumber);

    const handleNextPage = useCallback(() => {
        fetchNui<ServerPromiseResp<Message[]>>(MessageEvents.FETCH_MESSAGES, {
            conversationId: conversationId,
            page,
        }).then(resp => {
            if (resp.status !== 'ok') {
                addAlert({
                    message: t('MESSAGES.FEEDBACK.FETCHED_MESSAGES_FAILED'),
                    type: 'error',
                });

                return navigate('/messages');
            }

            if (resp.data.length === 0) {
                setHasMore(false);
                return;
            }

            setHasMore(true);
            setPage(curVal => curVal + 1);

            setMessages(currVal => [...resp.data, ...currVal]);
        });
    }, [addAlert, conversationId, setMessages, history, t, page, setPage]);

    return (
        <>
            <div>
                <div id={CONVERSATION_ELEMENT_ID} style={{ flex: 1, display: 'flex', overflowY: 'auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 'min-content',
                            width: '100%',
                        }}
                    >
                        <div id="scrollableDiv" className="flex flex-col-reverse h-[675px] overflow-auto">
                            <InfiniteScroll
                                next={handleNextPage}
                                scrollableTarget="scrollableDiv"
                                hasMore={hasMore}
                                inverse={true}
                                loader={<LoadingSpinner />}
                                dataLength={messages.length}
                            >
                                {messages.map(message => (
                                    <MessageBubble key={message.id} message={message} />
                                ))}
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
            <MessageImageModal
                image={referalImage}
                onClose={() => setImageModalOpen(false)}
                isOpen={imageModalOpen}
                messageGroupId={activeMessageGroup.conversation_id}
            />
            <MessageInput
                messageGroupName={conversationContact?.display || activeMessageGroup.phoneNumber}
                messageConversationId={activeMessageGroup.conversation_id}
                onAddImageClick={() => setImageModalOpen(true)}
            />
        </>
    );
};

export default Conversation;
