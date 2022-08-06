import { useQueryParams } from '@common/hooks/useQueryParams';
import { BackspaceIcon, PhoneIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React, { useContext, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCall } from '../../../os/call/hooks/useCall';
import { ThemeContext } from '../../../styles/themeProvider';
import { AppContent } from '../../../ui/components/AppContent';
import { InputBase } from '../../../ui/old_components/Input';
import { DialerButton } from '../components/DialerButton';

interface IFormInputs {
    number: string;
}

const DialerKeyboard: React.FC = () => {
    const query = useQueryParams();
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { initializeCall } = useCall();

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
    const removeOne = () => setValue('number', watch('number').toString().slice(0, -1));

    const handleCall = () => {
        initializeCall(watch('number').toString());
    };

    useLayoutEffect(() => {
        setValue('number', query.number || '555-');
    }, [query]);

    return (
        <AppContent scrollable={false}>
            <form onSubmit={onSubmit}>
                <div className="h-20 mb-20">
                    <div className="pt-10 h-full flex justify-center">
                        <InputBase
                            maxLength={8}
                            className={cn('bg-transparent w-2/4 text-center text-3xl', {
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
                        <DialerButton label={<BackspaceIcon className="h-8 w-8" />} onClick={removeOne} />
                        <DialerButton
                            type="submit"
                            label={<PhoneIcon className="text-white h-8 w-8" />}
                            onClick={handleCall}
                            className="col-start-2 bg-[#2DD158] hover:bg-[#21B147]"
                        />
                    </div>
                </div>

                {/*<DialGrid />*/}
            </form>
        </AppContent>
    );
};

export default DialerKeyboard;
