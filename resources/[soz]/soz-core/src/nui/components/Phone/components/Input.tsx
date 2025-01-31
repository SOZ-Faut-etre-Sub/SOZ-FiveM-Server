import { fetchNui } from '@public/nui/fetch';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { PatternFormat } from 'react-number-format';

import { NuiEvent } from '../../../../shared/event/nui';
import { useThemeConfig } from '../system/config/config.atom';
import { useSetPhoneInsideInput } from '../system/phone.atom';

export const useToggleKeys = () => {
    const setInsideInput = useSetPhoneInsideInput();

    return (insideInput: boolean) => {
        setInsideInput(insideInput);
        fetchNui(NuiEvent.PhoneInsideInput, { insideInput });
    };
};

export const TextField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const theme = useThemeConfig();
    const toggleKeys = useToggleKeys();

    return (
        <input
            ref={ref}
            {...props}
            className={clsx('w-full rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none', props.className, {
                'bg-ios-700 text-white': theme === 'dark',
                'bg-gray-300 text-black': theme === 'light',
            })}
            onMouseUp={e => {
                toggleKeys(true);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                toggleKeys(false);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});

export const NumberField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const theme = useThemeConfig();
    const toggleKeys = useToggleKeys();

    return (
        <PatternFormat
            ref={ref}
            {...props}
            className={clsx('w-full rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none', props.className, {
                'bg-ios-700 text-white': theme === 'dark',
                'bg-gray-300 text-black': theme === 'light',
            })}
            onMouseUp={e => {
                toggleKeys(true);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                toggleKeys(false);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});

export const TextareaField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const theme = useThemeConfig();
    const toggleKeys = useToggleKeys();

    return (
        <textarea
            ref={ref}
            {...props}
            className={clsx(
                'w-full h-full resize-none rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none',
                props.className,
                {
                    'bg-ios-700 text-white': theme === 'dark',
                    'bg-gray-300 text-black': theme === 'light',
                }
            )}
            onMouseUp={e => {
                toggleKeys(true);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                toggleKeys(false);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});

export const InputBase = forwardRef<HTMLInputElement, any>((props, ref) => {
    const toggleKeys = useToggleKeys();

    return (
        <input
            ref={ref}
            {...props}
            onMouseUp={e => {
                toggleKeys(true);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                toggleKeys(false);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});
