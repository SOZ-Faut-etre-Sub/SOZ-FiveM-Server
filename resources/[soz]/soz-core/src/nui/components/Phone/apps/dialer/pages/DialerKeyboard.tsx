import { BackspaceIcon, ChatAltIcon, PhoneIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCallAPI } from '../../../api/useCallAPI';
import { InputBase } from '../../../components/Input';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useThemeConfig } from '../../../system/config/config.atom';
import { DialerButton } from '../components/DialerButton';

interface IFormInputs {
    number: string;
}

export const DialerKeyboard: FunctionComponent = () => {
    const navigate = useNavigate();

    const theme = useThemeConfig();

    const query = useQueryParams();
    const { initializeCall } = useCallAPI();

    const { register, setValue, watch, handleSubmit } = useForm<IFormInputs>();
    const onSubmit = handleSubmit(() => {});

    const handleNewContact = () => {
        const number = watch('number').toString();
        if (number.length === 8) {
            navigate(`/contacts/-1/?addNumber=${number}&referral=/phone/contacts`);
        }
    };

    const add = (val: string) => {
        const number = watch('number').toString();
        if (number.length >= 8) {
            return;
        }
        setValue('number', number + val);
    };

    const startMessage = () => {
        const number = watch('number').toString();
        if (number.length !== 8) {
            return;
        }

        if (!/^555-[\d-]{4}$/i.test(number)) return;

        navigate(`/messages/new/${number}`);
    };

    const removeOne = () => setValue('number', watch('number').toString().slice(0, -1));

    const handleCall = () => {
        const number = watch('number').toString();
        if (number.length !== 8) {
            return;
        }
        initializeCall(number);
    };

    useLayoutEffect(() => {
        setValue('number', query.number || '555-');
    }, [query]);

    return (
        <AppWrapper>
            <AppContent>
                <form onSubmit={onSubmit}>
                    <div className="mb-20">
                        <div className="pt-10 h-full flex justify-center">
                            <InputBase
                                maxLength={8}
                                className={clsx('bg-transparent w-full text-center text-6xl', {
                                    'text-white': theme === 'dark',
                                    'text-black': theme === 'light',
                                })}
                                {...register('number', { pattern: /^555-[\d-]{4}$/i })}
                                defaultValue={query.number || ''}
                            />
                        </div>

                        {watch('number')?.length === 8 && (
                            <p
                                className="text-center font-bold text-[#347DD9] cursor-pointer pt-2"
                                onClick={handleNewContact}
                            >
                                Ajouter le contact
                            </p>
                        )}
                    </div>

                    <div className="text-white">
                        <div className="grid grid-cols-3 justify-items-center mx-8">
                            <DialerButton label={1} onClick={() => add('1')} />
                            <DialerButton label={2} onClick={() => add('2')} />
                            <DialerButton label={3} onClick={() => add('3')} />
                            <DialerButton label={4} onClick={() => add('4')} />
                            <DialerButton label={5} onClick={() => add('5')} />
                            <DialerButton label={6} onClick={() => add('6')} />
                            <DialerButton label={7} onClick={() => add('7')} />
                            <DialerButton label={8} onClick={() => add('8')} />
                            <DialerButton label={9} onClick={() => add('9')} />
                            <DialerButton label="-" onClick={() => add('-')} />
                            <DialerButton label={0} onClick={() => add('0')} />
                            <DialerButton label={<BackspaceIcon className="size-8" />} onClick={removeOne} />
                        </div>

                        <div className="grid grid-cols-2 justify-items-center mx-8">
                            <DialerButton
                                type="submit"
                                label={<PhoneIcon className="text-white size-12" />}
                                onClick={handleCall}
                                className="bg-[#2DD158] hover:bg-[#21B147]"
                            />
                            <DialerButton
                                type="submit"
                                label={<ChatAltIcon className="text-white size-12" />}
                                onClick={startMessage}
                                className="bg-[#2DD158] hover:bg-[#21B147]"
                            />
                        </div>
                    </div>
                </form>
            </AppContent>
        </AppWrapper>
    );
};
