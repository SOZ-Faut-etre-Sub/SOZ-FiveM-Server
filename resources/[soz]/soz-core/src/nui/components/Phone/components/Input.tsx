import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { PatternFormat } from 'react-number-format';

import { useThemeConfig } from '../system/config/config.atom';

export const TextField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const theme = useThemeConfig();

    return (
        <input
            ref={ref}
            {...props}
            className={clsx('w-full rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none', props.className, {
                'bg-ios-700 text-white': theme === 'dark',
                'bg-gray-300 text-black': theme === 'light',
            })}
            onMouseUp={e => {
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});

export const NumberField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const theme = useThemeConfig();

    return (
        <PatternFormat
            ref={ref}
            {...props}
            className={clsx('w-full rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none', props.className, {
                'bg-ios-700 text-white': theme === 'dark',
                'bg-gray-300 text-black': theme === 'light',
            })}
            onMouseUp={e => {
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
            allowEmptyFormatting
        />
    );
});

export const TextareaField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const theme = useThemeConfig();

    return (
        <textarea
            ref={ref}
            {...props}
            className={clsx(
                'w-full h-full resize-none rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none',
                'scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                props.className,
                {
                    'scrollbar-thumb-white/80': theme === 'dark',
                    'scrollbar-thumb-black/20': theme === 'light',
                    'bg-ios-700 text-white': theme === 'dark',
                    'bg-gray-300 text-black': theme === 'light',
                }
            )}
            onMouseUp={e => {
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});

export const InputBase = forwardRef<HTMLInputElement, any>((props, ref) => {
    return (
        <input
            ref={ref}
            {...props}
            onMouseUp={e => {
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={e => {
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    );
});
