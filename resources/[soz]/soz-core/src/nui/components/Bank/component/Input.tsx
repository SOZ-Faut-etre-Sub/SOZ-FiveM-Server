import { animated, useSpring } from '@react-spring/web';
import classnames from 'classnames';
import React, { forwardRef, HTMLInputTypeAttribute } from 'react';
import { FieldError } from 'react-hook-form';
import { GiPayMoney } from 'react-icons/gi';

import { inputErrorMessage } from '../utils/format';
import { InputAlertIcon } from './AlertIcon';

interface InputProps {
    type?: HTMLInputTypeAttribute;
    prefix?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: FieldError;
    autofill?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const errorStyle = useSpring({
        height: props.error ? 16 : 0,
        y: props.error ? 0 : -16,
        opacity: props.error ? 1 : 0,
    });

    return (
        <div>
            <div className="relative">
                {props.prefix && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-white sm:text-sm pt-0.5">$</span>
                    </div>
                )}
                <input
                    ref={ref}
                    className={classnames(
                        'block w-full rounded-md border-0 py-1.5 bg-white/5 text-gray-200 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6',
                        {
                            'pl-7': props.prefix,
                            'pl-2': !props.prefix,
                            'ring-gray-500/10 focus:ring-teal-600/50': !props.error,
                            'ring-red-500/10 focus:ring-red-600/50': props.error,
                            'pr-2': !props.error && !props.autofill,
                            'pr-9': props.error && !props.autofill,
                            'pr-14': props.error && props.autofill,
                        }
                    )}
                    {...props}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
                    {props.autofill && <GiPayMoney className="text-teal-500 cursor-pointer" onClick={props.autofill} />}
                    {props.error && <InputAlertIcon />}
                </div>
            </div>
            {props.error && (
                <animated.div style={errorStyle} className="text-red-400 text-sm pt-1 px-2">
                    {props.error && (props.error.message || inputErrorMessage(props.error.type))}
                </animated.div>
            )}
        </div>
    );
});
