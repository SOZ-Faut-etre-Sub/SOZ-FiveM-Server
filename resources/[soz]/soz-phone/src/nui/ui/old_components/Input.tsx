import { PhoneEvents } from '@typings/phone';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import cn from 'classnames';
import React, { forwardRef } from 'react';

import { useConfig } from '../../hooks/usePhone';

export const toggleKeys = (keepGameFocus: boolean) =>
    fetchNui(PhoneEvents.TOGGLE_KEYS, {
        keepGameFocus,
    }).catch(e => (isEnvBrowser() ? () => {} : console.error(e)));

export const TextField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const config = useConfig();

    return (
        <input
            ref={ref}
            {...props}
            className={cn('w-full rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none', props.className, {
                'bg-[#1C1C1E] text-white': config.theme.value === 'dark',
                'bg-gray-300 text-black': config.theme.value === 'light',
            })}
            onFocus={e => {
                toggleKeys(false);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                toggleKeys(true);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});
export const TextareaField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const config = useConfig();

    return (
        <textarea
            ref={ref}
            {...props}
            className={cn(
                'w-full h-full resize-none my-4 rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none',
                props.className,
                {
                    'bg-[#1C1C1E] text-white': config.theme.value === 'dark',
                    'bg-gray-300 text-black': config.theme.value === 'light',
                }
            )}
            onFocus={e => {
                toggleKeys(false);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                toggleKeys(true);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});

export const InputBase: React.FC<any> = forwardRef((props, ref) => (
    <input
        ref={ref}
        {...props}
        onFocus={e => {
            toggleKeys(false);
            if (props.onFocus) {
                props.onFocus(e);
            }
        }}
        onBlur={e => {
            toggleKeys(true);
            if (props.onBlur) {
                props.onBlur(e);
            }
        }}
    />
));
