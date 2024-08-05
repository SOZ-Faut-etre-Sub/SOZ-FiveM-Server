import { Transition } from '@headlessui/react';
import { BanIcon, ChevronLeftIcon, ExclamationIcon, LockClosedIcon, PencilIcon, XIcon } from '@heroicons/react/solid';
import { DarkwebConversation, DarkwebParticipant } from '@typings/app/darkweb';
import cn from 'classnames';
import { ChangeEvent, FunctionComponent, memo, useEffect, useState } from 'react';

import { useDarkweb } from '../../../hooks/app/useDarkweb';
import { usePhoneNumber } from '../../../hooks/useSimCard';
import { UseDarkwebAPI } from '../hooks/useDarkwebApi';

interface DarkWebConversationSettingsModalProps {
    isOpen: boolean;
    onClose(): void;
    conversation: DarkwebConversation;
}

export const DarkWebConversationSettingsModal = memo(
    ({ isOpen, onClose, conversation }: DarkWebConversationSettingsModalProps) => {
        //const [t] = useTranslation();
        const { getDarkwebConversationParticipants } = useDarkweb();
        const { updateParticipantRole, archiveConversation, updateConversation } = UseDarkwebAPI();
        const [passwordInputValue, setPasswordInputValue] = useState<string>('');
        const [newAdminInputValue, setNewAdminInputValue] = useState<string>('');
        const [subjectInputValue, setSubjectInputValue] = useState<string>(conversation.label);

        const [editErrorMessage, setEditErrorMessage] = useState<string>('');
        const [newAdminErrorMessage, setNewAdminErrorMessage] = useState<string>('');

        const [isOpenAdminManagement, setIsOpenAdminManagement] = useState<boolean>(false);
        const [isOpenAdminManagementNew, setIsOpenAdminManagementNew] = useState<boolean>(false);
        const [isEditConversationOpen, setIsEditConversationOpen] = useState<boolean>(false);
        const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);

        const participants = getDarkwebConversationParticipants(conversation.id);
        const admins = participants.filter(participant => participant.role === 'ADMIN');

        const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
            setPasswordInputValue(event.target.value);
        };

        const onSubjectInputValue = (event: ChangeEvent<HTMLInputElement>) => {
            setSubjectInputValue(event.target.value);
        };

        const onNewAdminChange = (event: ChangeEvent<HTMLInputElement>) => {
            const re = /^[0-9\b]+$/;
            const value = event.target.value;
            if (value.length > 4) {
                return;
            }

            if (!value) {
                setNewAdminInputValue('');
                return;
            }

            if (value === '' || re.test(value)) {
                setNewAdminInputValue(value);
            }
        };

        const myNumber = usePhoneNumber();

        const removeAdmin = (admin: DarkwebParticipant) => {
            updateParticipantRole(conversation.id, admin.phoneNumber, 'USER');
        };

        const newAdmin = phoneNumber => {
            const formattedPhoneNumber = `555-${phoneNumber}`;
            updateParticipantRole(conversation.id, formattedPhoneNumber, 'ADMIN');
        };

        const handleUpdateConversation = () => {
            if (!subjectInputValue) {
                setEditErrorMessage('ERROR : NO SUBJECT');
                return;
            }

            if (subjectInputValue.length < 4) {
                setEditErrorMessage('ERROR : SUBJECT TOO SHORT');
                return;
            }

            if (!passwordInputValue) {
                setEditErrorMessage('ERROR : NO PASSWORD');
                return;
            }

            if (passwordInputValue.length < 4) {
                setEditErrorMessage('ERROR : PASSWORD TOO SHORT');
                return;
            }

            updateConversation(conversation.id, subjectInputValue, passwordInputValue);
        };

        const handleDelete = () => {
            archiveConversation(conversation.id);
        };

        const handleNewAdminConfirm = () => {
            if (!newAdminInputValue || newAdminInputValue === '') {
                setNewAdminErrorMessage('ERROR : NO PHONE NUMBER');
                return;
            }

            if (newAdminInputValue.length < 4) {
                setNewAdminErrorMessage('ERROR : TOO SHORT');
                return;
            }
            newAdmin(newAdminInputValue);

            setIsOpenAdminManagementNew(false);
            setIsOpenAdminManagement(true);
        };

        const handleClose = () => {
            onClose();
        };

        useEffect(() => {
            setTimeout(() => {
                setEditErrorMessage(undefined);
            }, 4000);
        }, [editErrorMessage]);

        useEffect(() => {
            setTimeout(() => {
                setNewAdminErrorMessage(undefined);
            }, 4000);
        }, [newAdminErrorMessage]);

        useEffect(() => {
            setNewAdminInputValue('');
            setNewAdminErrorMessage('');
        }, [isOpenAdminManagementNew]);

        useEffect(() => {
            setEditErrorMessage('');
            setPasswordInputValue('');
        }, [isEditConversationOpen]);

        interface SettingButtonProps {
            icon: JSX.Element;
            onClick: () => void;
            title: string;
            type?: 'DELETE' | 'ACTION';
        }

        const SettingButton: FunctionComponent<SettingButtonProps> = ({ icon, onClick, title, type }) => {
            return (
                <div
                    onClick={onClick}
                    //className=" border-teal-500 text-teal-500 hover:text-teal-400 "
                    className={cn(
                        'flex flex-col border-2 rounded-3xl bg-black/20  w-[80px] h-[80px] justify-center items-center cursor-pointer',
                        {
                            'border-teal-500 text-teal-500 hover:text-teal-400': !type,
                            'border-red-600 text-red-600 hover:text-red-500': type === 'DELETE',
                        }
                    )}
                >
                    {icon}
                    <span className="uppercase font-black text-xs pt-1">{title}</span>
                </div>
            );
        };

        return (
            <Transition
                show={isOpen}
                enter="transition duration-[0.5s] ease-out"
                enterFrom="translate-y-[20vh] opacity-100"
                enterTo=" opacity-100"
                leave="transition duration-[0.5s] ease-out"
                leaveFrom=" opacity-100"
                leaveTo="translate-y-[20vh] opacity-100"
                className={cn(
                    'absolute h-[35%] bottom-0 w-full flex bg-gradient-to-t from-zinc-900 from-30% via-zinc-900 via-40% to-teal-900/90 to-30% rounded-t-3xl'
                )}
            >
                {!isEditConversationOpen &&
                    !isOpenAdminManagement &&
                    !isDeleteConfirmationOpen &&
                    !isOpenAdminManagementNew && (
                        <div className="flex flex-col h-full w-full">
                            <div className="flex justify-center h-fit flex-wrap rounded-t-3xl w-full pt-2 pb-2 bg-black/40">
                                <p className="text-2xl font-bold text-teal-500 uppercase">Settings</p>
                                <span
                                    className="text-teal-500 absolute right-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                    onClick={handleClose}
                                >
                                    <XIcon width={'2vh'} height={'2vh'} />
                                </span>
                            </div>
                            <div className="flex h-full">
                                <div className="flex flex-row  w-full py-4 px-3 top-0 h-fit justify-around">
                                    <SettingButton
                                        title={'Edit'}
                                        icon={<PencilIcon width={'45px'} height={'45px'} />}
                                        onClick={() => {
                                            setIsEditConversationOpen(true);
                                        }}
                                    />
                                    <SettingButton
                                        title={'Access'}
                                        icon={<LockClosedIcon width={'45px'} height={'45px'} />}
                                        onClick={() => {
                                            setIsOpenAdminManagement(true);
                                        }}
                                    />
                                    <SettingButton
                                        title={'Delete'}
                                        icon={<ExclamationIcon width={'45px'} height={'45px'} />}
                                        type="DELETE"
                                        onClick={() => {
                                            setIsDeleteConfirmationOpen(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                {isEditConversationOpen && (
                    <div className="flex flex-col h-full w-full">
                        <div className="flex justify-center h-fit flex-wrap rounded-t-3xl w-full pt-2 pb-2 bg-black/40">
                            <span
                                className="text-teal-500 absolute left-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={() => setIsEditConversationOpen(false)}
                            >
                                <ChevronLeftIcon width={'2vh'} height={'2vh'} />
                            </span>
                            <p className="text-2xl font-bold text-teal-500 uppercase">Edition</p>
                            <span
                                className="text-teal-500 absolute right-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={handleClose}
                            >
                                <XIcon width={'2vh'} height={'2vh'} />
                            </span>
                        </div>
                        <div className="flex h-full">
                            <div className="flex flex-col w-full py-3 px-4">
                                <div className="flex flex-col h-[70%] items-center justify-center">
                                    <div className="max-h-[70%] flex flex-col justify-center">
                                        <input
                                            className={`${
                                                !editErrorMessage
                                                    ? 'border-teal-500 rounded-lg text-teal-500 focus-within:border-teal-400 placeholder:text-teal-700'
                                                    : 'border-red-500 rounded-lg text-red-500 focus-within:border-red-600 placeholder:text-red-700'
                                            } mt-2 bg-transparent text-[2xl] py-2 px-4 text-center outline-none border-[0.2vh]`}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                onSubjectInputValue(event);
                                            }}
                                            value={subjectInputValue}
                                            placeholder="SUBJECT"
                                        />
                                        <input
                                            className={`${
                                                !editErrorMessage
                                                    ? 'border-teal-500 rounded-lg text-teal-500 focus-within:border-teal-400 placeholder:text-teal-700'
                                                    : 'border-red-500 rounded-lg text-red-500 focus-within:border-red-600 placeholder:text-red-700'
                                            } mt-2 bg-transparent text-[2xl] py-2 px-4 text-center outline-none border-[0.2vh]`}
                                            onKeyDown={e => {
                                                e.key === 'Enter' ? handleUpdateConversation() : null;
                                            }}
                                            type="password"
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                onPasswordChange(event);
                                            }}
                                            placeholder="PASSWORD"
                                            value={passwordInputValue}
                                        />
                                    </div>
                                    <h1 className="text-red-500 text-xl font-bold text-center mt-1 min-h-[3vh]">
                                        {editErrorMessage}
                                    </h1>
                                </div>
                                <div className="flex justify-center items-center">
                                    <button
                                        className="border-[0.2vh] py-2 px-4 text-teal-500 border-teal-500 rounded-lg my-2 hover:bg-teal-900 cursor-pointer uppercase"
                                        onClick={() => handleUpdateConversation()}
                                    >
                                        Valider
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isOpenAdminManagement && (
                    <div className="flex flex-col h-full w-full">
                        <div className="flex justify-center h-fit flex-wrap rounded-t-3xl w-full pt-2 pb-2 bg-black/40">
                            <span
                                className="text-teal-500 absolute left-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={() => setIsOpenAdminManagement(false)}
                            >
                                <ChevronLeftIcon width={'2vh'} height={'2vh'} />
                            </span>
                            <p className="text-2xl font-bold text-teal-500 uppercase">Admin</p>
                            <span
                                className="text-teal-500 absolute right-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={handleClose}
                            >
                                <XIcon width={'2vh'} height={'2vh'} />
                            </span>
                        </div>
                        <div className="flex h-full">
                            <div className="flex flex-col w-full py-3 px-4">
                                <div className="h-[70%]">
                                    {admins &&
                                        admins.map(admin => {
                                            return (
                                                <div
                                                    className="flex flex-row justify-between items-center px-6"
                                                    key={admin.user_identifier}
                                                >
                                                    <div className="text-teal-500 text-xl font-black w-[60%]">
                                                        {admin.phoneNumber}
                                                    </div>
                                                    <div className="text-teal-500 text-xl font-black w-[60%]">
                                                        {admin.role}
                                                    </div>
                                                    <div
                                                        className={cn({
                                                            'text-red-500 cursor-pointer':
                                                                admin.phoneNumber !== myNumber,
                                                            'text-zync-400': admin.phoneNumber == myNumber,
                                                        })}
                                                        onClick={() => {
                                                            admin.phoneNumber !== myNumber ? removeAdmin(admin) : '';
                                                        }}
                                                    >
                                                        <BanIcon width={'40px'} height={'40px'} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="flex justify-center items-center">
                                    <button
                                        className="border-[0.2vh] py-2 px-4 text-teal-500 border-teal-500 rounded-lg my-2 hover:bg-teal-900 cursor-pointer"
                                        onClick={() => {
                                            setIsOpenAdminManagement(false);
                                            setIsOpenAdminManagementNew(true);
                                        }}
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isOpenAdminManagementNew && (
                    <div className="flex flex-col h-full w-full">
                        <div className="flex justify-center h-fit flex-wrap rounded-t-3xl w-full pt-2 pb-2 bg-black/40">
                            <span
                                className="text-teal-500 absolute left-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={() => {
                                    setIsOpenAdminManagementNew(false);
                                    setIsOpenAdminManagement(true);
                                }}
                            >
                                <ChevronLeftIcon width={'2vh'} height={'2vh'} />
                            </span>
                            <p className="text-2xl font-bold text-teal-500 uppercase">New Admin</p>
                            <span
                                className="text-teal-500 absolute right-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={handleClose}
                            >
                                <XIcon width={'2vh'} height={'2vh'} />
                            </span>
                        </div>
                        <div className="flex h-full">
                            <div className="flex flex-col w-full py-3 px-4">
                                <div className="flex flex-col h-[70%] items-center justify-center">
                                    <div className="max-h-[70%]">
                                        <input
                                            className={`${
                                                !newAdminErrorMessage
                                                    ? 'border-teal-500 rounded-lg text-teal-500 focus-within:border-teal-400 placeholder:text-teal-700'
                                                    : 'border-red-500 rounded-lg text-red-500 focus-within:border-red-600 placeholder:text-red-700'
                                            } mt-2 bg-transparent text-[2xl] py-2 px-4 text-center outline-none border-[0.2vh]`}
                                            onKeyDown={e => {
                                                e.key === 'Enter' ? handleNewAdminConfirm() : null;
                                            }}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                onNewAdminChange(event);
                                            }}
                                            placeholder="555-5555"
                                            maxLength={4}
                                            value={newAdminInputValue}
                                        />
                                    </div>
                                    <h1 className="text-red-500 text-2xl font-bold text-center mt-5 min-h-[3vh]">
                                        {newAdminErrorMessage}
                                    </h1>
                                </div>
                                <div className="flex justify-center items-center">
                                    <button
                                        className="border-[0.2vh] py-2 px-4 text-teal-500 border-teal-500 rounded-lg my-2 hover:bg-teal-900 cursor-pointer uppercase"
                                        onClick={() => handleNewAdminConfirm()}
                                    >
                                        Valider
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isDeleteConfirmationOpen && (
                    <div className="flex flex-col h-full w-full">
                        <div className="flex justify-center h-fit flex-wrap rounded-t-3xl w-full pt-2 pb-2 bg-black/40">
                            <span
                                className="text-teal-500 absolute left-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                            >
                                <ChevronLeftIcon width={'2vh'} height={'2vh'} />
                            </span>
                            <p className="text-2xl font-bold text-teal-500 uppercase">Delete</p>
                            <span
                                className="text-teal-500 absolute right-[1vh] rounded-2xl cursor-pointer hover:bg-teal-900"
                                onClick={handleClose}
                            >
                                <XIcon width={'2vh'} height={'2vh'} />
                            </span>
                        </div>
                        <div className="flex h-full">
                            <div className="flex justify-center items-center w-full">
                                <button
                                    className="border-[0.2vh] py-2 px-4 text-red-500 border-red-500 rounded-lg my-2 hover:bg-red-900 cursor-pointer uppercase"
                                    onClick={() => handleDelete()}
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Transition>
        );
    }
);
