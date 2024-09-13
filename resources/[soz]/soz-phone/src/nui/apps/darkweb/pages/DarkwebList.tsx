import { Transition } from '@headlessui/react';
import { DarkwebConversation, ThreadPrice } from '@typings/app/darkweb';
import { AppContent } from '@ui/components/AppContent';
import { InputBase } from '@ui/old_components/Input';
import cn from 'classnames';
import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState, store } from '../../../../nui/store';
import { useConfig } from '../../../hooks/usePhone';
import { DarkWebConversationCreateModal } from '../components/DarkwebConversationCreateModal';
import { DarkWebConversationPasswordModal } from '../components/DarkwebConversationPasswordModal';
import { DarkWebSubjectListItem } from '../components/DarkwebSubjectListItem';
import { UseDarkwebAPI } from '../hooks/useDarkwebApi';

export const DarkWebList = memo(() => {
    const [t] = useTranslation();
    const config = useConfig();
    const navigate = useNavigate();
    const { addConversation, getConversations } = UseDarkwebAPI();

    const [isCreationModalOpen, setIsCreationModalOpen] = useState<boolean>(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
    const [selectedDarkwebConversation, setSelectedDarkwebConversation] = useState<DarkwebConversation>(null);
    const [searchValueInput, setSearchValueInput] = useState<string>('');
    const darkwebConversations = useSelector((state: RootState) => state.appDarkweb.conversations);
    const darkwebParticipants = useSelector((state: RootState) => state.appDarkweb.participants);
    const number = useSelector((state: RootState) => state.simCard.number);

    const filteredConversations = useMemo(() => {
        if (!darkwebConversations) {
            return [];
        }
        const regExp = new RegExp(searchValueInput.replace(/[^a-zA-Z\d]/g, ''), 'gi');
        return darkwebConversations.filter(c => c.masked === false).filter(c => c?.label?.match(regExp) || '');
    }, [darkwebConversations, searchValueInput]);

    const getReadStatusByConversation = conversationId => {
        if (!darkwebConversations || !darkwebParticipants) {
            return false;
        }

        return darkwebParticipants.find(
            darkwebParticipants =>
                darkwebParticipants.conversation_id === conversationId && darkwebParticipants.phoneNumber === number
        )?.unread;
    };

    useEffect(() => {
        getConversations();
        store.dispatch.appDarkweb.loadDarkwebParticipants();
    }, []);

    const onCreationConfirm = ({ subject, password }) => {
        addConversation(subject, password);
        getConversations();
        store.dispatch.appDarkweb.loadDarkwebParticipants();
    };

    const onPasswordConfirm = isPasswordCorrect => {
        if (!isPasswordCorrect) {
            return;
        }
        navigate(`${selectedDarkwebConversation.id}`);
    };

    const handleOpenPasswordModal = (darkwebConversation: DarkwebConversation) => {
        setIsCreationModalOpen(false);
        if (isPasswordModalOpen) {
            setIsPasswordModalOpen(false);
            setSelectedDarkwebConversation(null);
        } else {
            setIsPasswordModalOpen(true);
            setSelectedDarkwebConversation(darkwebConversation);
        }
    };

    const handleOpenCreationModal = () => {
        setIsPasswordModalOpen(false);
        if (isCreationModalOpen) {
            setIsCreationModalOpen(false);
        } else {
            setIsCreationModalOpen(true);
        }
    };

    const handleOpenConversation = darkwebConversation => {
        if (darkwebConversation?.password) {
            handleOpenPasswordModal(darkwebConversation);
        } else {
            navigate(`${darkwebConversation.id}`);
        }
    };

    return (
        <Transition
            appear={true}
            show={true}
            className="pb-0 px-0"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppContent className="pb-0 px-0">
                <div>
                    <h1 className="text-teal-500 text-3xl font-bold text-center mt-5 min-h-[3vh]">THREADS</h1>
                </div>
                <div className="w-full flex px-2">
                    <InputBase
                        className={
                            'border-teal-500/50 rounded-lg text-teal-500 placeholder:text-teal-700 focus-within:border-teal-400 mt-2 bg-transparent  text-[2xl] p-2 px-4 mb-2 outline-none border-[0.2vh] w-full'
                        }
                        placeholder="Recherche"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setSearchValueInput(event.target.value);
                        }}
                        value={searchValueInput}
                    />
                </div>
                <div className="h-[560px] mb-2 overflow-y-auto">
                    {!filteredConversations && (
                        <h2
                            className={cn('flex justify-center items-center', {
                                'text-white': config.theme.value === 'dark',
                                'text-dark': config.theme.value === 'light',
                            })}
                        >
                            {t('DARKWEB.LOADING')}
                        </h2>
                    )}
                    {filteredConversations &&
                        filteredConversations.map(darkwebConversation => {
                            return (
                                <DarkWebSubjectListItem
                                    key={darkwebConversation.id}
                                    data={darkwebConversation}
                                    onClick={() => handleOpenConversation(darkwebConversation)}
                                    readStatus={getReadStatusByConversation(darkwebConversation.id)}
                                />
                            );
                        })}
                </div>
                <div className="flex justify-center items-center">
                    <button
                        className="border-[0.2vh] py-2 px-4 text-teal-500 border-teal-500 rounded-lg my-2 hover:bg-teal-900 cursor-pointer"
                        onClick={() => handleOpenCreationModal()}
                    >
                        NOUVEAU THREAD ({ThreadPrice.toLocaleString()}$)
                    </button>
                </div>

                <DarkWebConversationCreateModal
                    onClose={() => setIsCreationModalOpen(false)}
                    isOpen={isCreationModalOpen}
                    onConfirm={e => onCreationConfirm(e)}
                />

                <DarkWebConversationPasswordModal
                    onClose={() => setIsPasswordModalOpen(false)}
                    isOpen={isPasswordModalOpen}
                    onConfirm={e => onPasswordConfirm(e)}
                    password={selectedDarkwebConversation?.password ?? null}
                />
            </AppContent>
        </Transition>
    );
});
