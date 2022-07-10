import { useQueryParams } from '@common/hooks/useQueryParams';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import React from 'react';

import NewMessageGroupForm from '../form/NewMessageGroupForm';

const MessageGroupModal = () => {
    const { phoneNumber } = useQueryParams<{ phoneNumber?: string }>();

    return (
        <React.Suspense fallback={<LoadingSpinner />}>
            <NewMessageGroupForm phoneNumber={phoneNumber} />
        </React.Suspense>
    );
};

export default MessageGroupModal;
