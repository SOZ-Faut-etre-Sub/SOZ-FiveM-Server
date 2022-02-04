import React from 'react';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import {useQueryParams} from '@common/hooks/useQueryParams';

const MessageGroupModal = () => {
    const {phoneNumber} = useQueryParams<{ phoneNumber?: string }>();

    return (
        <React.Suspense fallback={<LoadingSpinner/>}>
            <NewMessageGroupForm phoneNumber={phoneNumber}/>
        </React.Suspense>
    );
};

export default MessageGroupModal;
