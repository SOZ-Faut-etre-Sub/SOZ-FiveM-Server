import { Transition } from '@headlessui/react';
import { LockOpenIcon, XCircleIcon } from '@heroicons/react/outline';
import { ChangeEvent, memo, useEffect, useState } from 'react';

import { InputBase } from '../../../components/Input';

interface DarkWebConversationPasswordModalProps {
    isOpen: boolean;

    onClose(): void;

    onConfirm(isPasswordCorrect: boolean): void;

    password: string;
}

export const DarkWebConversationPasswordModal = memo(
    ({ isOpen, onClose, onConfirm, password }: DarkWebConversationPasswordModalProps) => {
        const [passwordInputValue, setPasswordInputValue] = useState<string>('');
        const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
        const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
            setPasswordInputValue(event.target.value);
        };

        const handleConfirm = () => {
            if (!passwordInputValue && password !== '') {
                setPasswordErrorMessage('Entrez un mot de passe');
            }
            if (password === passwordInputValue) {
                onConfirm(true);
                setPasswordInputValue('');
                onClose();
            } else {
                setPasswordErrorMessage('ERREUR : Mot de passe incorrect');
                setPasswordInputValue('');
            }
        };

        useEffect(() => {
            if (passwordErrorMessage) {
                setTimeout(() => {
                    setPasswordErrorMessage(undefined);
                }, 4000);
            }
        }, [passwordErrorMessage]);

        useEffect(() => {
            setPasswordErrorMessage(undefined);
            setPasswordInputValue('');
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
                        !passwordErrorMessage ? 'text-teal-500' : 'text-red-500'
                    } rounded-lg items-center flex flex-col justify-center text-center py-4 w-5/6`}
                >
                    <div className="m-auto pt-1 pb-3 flex flex-col w-5/6">
                        <h2 className="text-4xl font-black mb-8 uppercase">Mot de Passe</h2>

                        <InputBase
                            className={`${
                                !passwordErrorMessage
                                    ? 'border-teal-500 rounded-lg text-teal-500 focus-within:border-teal-400 placeholder:text-teal-700'
                                    : 'border-red-500 rounded-lg text-red-500 focus-within:border-red-600 placeholder:text-red-700'
                            } mt-2 bg-transparent text-[2xl] py-2 px-4 text-center outline-none border-[0.2vh]`}
                            type="password"
                            onKeyDown={e => {
                                e.key === 'Enter' ? handleConfirm() : null;
                            }}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                onPasswordChange(event);
                            }}
                            value={passwordInputValue}
                        />
                    </div>
                    <h1 className="text-red-500 text-3xl font-bold text-center mt-5 min-h-[10vh]">
                        {passwordErrorMessage}
                    </h1>

                    <div className={'flex justify-between items-center mt-10 w-full px-20 '}>
                        <XCircleIcon
                            className={`${
                                !passwordErrorMessage ? 'text-teal-700 hover:text-teal-400' : 'text-red-500'
                            } h-[6vh] w-[6vh] cursor-pointer`}
                            onClick={onClose}
                        />

                        <LockOpenIcon
                            className={`${
                                !passwordErrorMessage ? 'text-teal-700 hover:text-teal-400' : 'text-red-500'
                            } h-[6vh] w-[6vh] cursor-pointer`}
                            onClick={() => handleConfirm()}
                        />
                    </div>
                </div>
            </Transition>
        );
    }
);
