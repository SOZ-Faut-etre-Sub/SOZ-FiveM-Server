import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { ChangeEvent, memo, useEffect, useState } from 'react';

import { InputBase } from '../../../components/Input';

interface DarkRoomCreationModalProps {
    isOpen: boolean;

    onClose(): void;

    onConfirm({ subject, password }): void;
}

export const DarkWebConversationCreateModal = memo(({ isOpen, onClose, onConfirm }: DarkRoomCreationModalProps) => {
    const [subject, setSubject] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleConfirm = () => {
        if (!subject) {
            setErrorMessage('ERREUR : Titre manquant');
            return;
        }

        if (!password) {
            setErrorMessage('ERREUR : Mot de passe manquant');
            return;
        }

        if (password && password.length < 4) {
            setErrorMessage('ERREUR : Mot de passe trop petit');
            return;
        }

        onConfirm({ subject: subject, password: password });
        onClose();
    };

    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage(null);
            }, 4000);
        }
    }, [errorMessage]);

    useEffect(() => {
        setErrorMessage('');
        setSubject('');
        setPassword('');
    }, [isOpen]);

    return (
        <Transition
            show={isOpen}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            className="absolute h-full top-0 left-0 w-full flex justify-center items-center bg-gradient-to-t from-zinc-900/90 from-30% via-zinc-900 via-40% to-teal-900/90 to-70%"
        >
            <div
                className={`${
                    !errorMessage ? 'text-teal-500' : 'text-red-500'
                } rounded-lg items-center flex flex-col justify-center text-center py-4 w-5/6`}
            >
                <div className="m-auto pt-1 pb-3 flex flex-col w-5/6">
                    <h2 className="text-4xl font-black mb-8 uppercase">NOUVEAU THREAD</h2>
                    <InputBase
                        className={`${
                            !errorMessage
                                ? 'border-teal-500 rounded-lg text-teal-500 focus-within:border-teal-400 placeholder:text-teal-700'
                                : 'border-red-500 rounded-lg text-red-500 focus-within:border-red-600 placeholder:text-red-700'
                        } mt-2 bg-transparent  text-[2xl] py-2 px-4 mb-2 outline-none border-[0.2vh]`}
                        placeholder="Titre"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setSubject(event.target.value);
                        }}
                        value={subject}
                    />
                    <InputBase
                        className={`${
                            !errorMessage
                                ? 'border-teal-500 rounded-lg text-teal-500 focus-within:border-teal-400 placeholder:text-teal-700'
                                : 'border-red-500 rounded-lg text-red-500 focus-within:border-red-600 placeholder:text-red-700'
                        } mt-2 bg-transparent  text-[2xl] py-2 px-4  outline-none border-[0.2vh]`}
                        placeholder="Mot de passe"
                        type="password"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }}
                        value={password}
                    />
                </div>
                <h1 className="text-red-500 text-3xl font-bold text-center mt-5 min-h-[10vh]">{errorMessage}</h1>

                <div className={'flex justify-between items-center mt-10 w-full px-20 '}>
                    <XCircleIcon
                        className={`${
                            !errorMessage ? 'text-teal-700 hover:text-teal-400' : 'text-red-500'
                        } h-[6vh] w-[6vh] cursor-pointer`}
                        onClick={onClose}
                    />

                    <CheckCircleIcon
                        className={`${
                            !errorMessage ? 'text-teal-700 hover:text-teal-400' : 'text-red-500'
                        } h-[6vh] w-[6vh] cursor-pointer`}
                        onClick={() => handleConfirm()}
                    />
                </div>
            </div>
        </Transition>
    );
});
