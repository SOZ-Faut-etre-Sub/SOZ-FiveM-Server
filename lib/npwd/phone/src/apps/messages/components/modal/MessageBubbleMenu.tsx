import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelectedMessageValue} from '../../hooks/state';
import {useMessageAPI} from '../../hooks/useMessageAPI';
import {Transition} from "@headlessui/react";
import {Button} from "@ui/components/Button";
import {TrashIcon} from "@heroicons/react/solid";
import {XIcon} from "@heroicons/react/outline";

interface MessageBubbleMenuProps {
    open: boolean;
    handleClose: () => void;
}

const MessageBubbleMenu: React.FC<MessageBubbleMenuProps> = ({open, handleClose}) => {
    const [t] = useTranslation();
    const {deleteMessage} = useMessageAPI();
    const selectedMessage = useSelectedMessageValue();

    const handleDeleteMessage = useCallback(() => {
        deleteMessage(selectedMessage);
    }, [deleteMessage, selectedMessage]);

    return <Transition
        show={open}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
    >
        <ul className="absolute z-30 right-0 w-56 mt-2 origin-top-right bg-black bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
            <li>
                <Button
                    className="flex items-center w-full text-red-400 px-2 py-2 hover:text-red-500"
                    onClick={handleDeleteMessage}
                >
                    <TrashIcon className="mx-3 h-5 w-5"/> {t('MESSAGES.FEEDBACK.DELETE_MESSAGE')}
                </Button>
            </li>
            <li>
                <Button
                    className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                    onClick={handleClose}
                >
                    <XIcon className="mx-3 h-5 w-5"/> Fermer
                </Button>
            </li>
        </ul>
    </Transition>
};

export default MessageBubbleMenu;
