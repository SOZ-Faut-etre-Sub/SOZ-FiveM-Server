import { Transition } from '@headlessui/react';
import { DarkwebConversation, THREAD_PRICE } from '@public/shared/phone/apps/darkweb';
import clsx from 'clsx';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { InputBase } from '../../../components/Input';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useSimCard } from '../../../system/sim-card/hooks/useSimCard';
import { DarkWebConversationCreateModal } from '../components/DarkwebConversationCreateModal';
import { DarkWebConversationPasswordModal } from '../components/DarkwebConversationPasswordModal';
import { DarkWebSubjectListItem } from '../components/DarkwebSubjectListItem';
import { useDarkWebConversations, useDarkWebParticipants } from '../darkweb.atom';
import { useConversations } from '../hooks/useConversations';
import { useDarkWebAPI } from '../hooks/useDarkwebApi';

export const DarkChatConversations = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const theme = useThemeConfig();

    const { conversations, searchValue, setSearchValue } = useConversations();

    const [isCreationModalOpen, setIsCreationModalOpen] = useState<boolean>(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
    const [selectedDarkwebConversation, setSelectedDarkwebConversation] = useState<DarkwebConversation>(null);

    const { fetchConversations, createConversation } = useDarkWebAPI();

    const darkwebParticipants = useDarkWebParticipants();
    const { number } = useSimCard();

    const getReadStatusByConversation = conversationId => {
        if (!darkwebParticipants) {
            return false;
        }

        return darkwebParticipants.find(
            darkwebParticipants =>
                darkwebParticipants.conversation_id === conversationId && darkwebParticipants.phoneNumber === number
        )?.unread;
    };

    const onCreationConfirm = async ({ subject, password }) => {
        await createConversation(subject, password);
        await fetchConversations();
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

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <AppWrapper>
            <AppContent>
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
                            setSearchValue(event.target.value);
                        }}
                        value={searchValue}
                    />
                </div>
                <div className="h-[650px] mb-2 overflow-y-auto">
                    {!conversations ? (
                        <h2
                            className={clsx('flex justify-center items-center', {
                                'text-white': theme === 'dark',
                                'text-dark': theme === 'light',
                            })}
                        >
                            {t('DARKWEB.LOADING')}
                        </h2>
                    ) : (
                        conversations.map(darkwebConversation => {
                            return (
                                <DarkWebSubjectListItem
                                    key={darkwebConversation.id}
                                    data={darkwebConversation}
                                    onClick={() => handleOpenConversation(darkwebConversation)}
                                    readStatus={getReadStatusByConversation(darkwebConversation.id)}
                                />
                            );
                        })
                    )}
                </div>
                <div className="flex justify-center items-center">
                    <button
                        className="border-[0.2vh] py-2 px-4 text-teal-500 border-teal-500 rounded-lg my-2 hover:bg-teal-900 cursor-pointer"
                        onClick={() => handleOpenCreationModal()}
                    >
                        NOUVEAU THREAD ({THREAD_PRICE.toLocaleString()}$)
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
        </AppWrapper>
    );
};
