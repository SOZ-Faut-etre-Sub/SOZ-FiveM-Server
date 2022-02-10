import React, {forwardRef, useContext} from 'react';
import { PhoneEvents } from '@typings/phone';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import {ThemeContext} from "../../styles/themeProvider";

export const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(PhoneEvents.TOGGLE_KEYS, {
    keepGameFocus,
  }).catch((e) => (isEnvBrowser() ? () => {} : console.error(e)));

export const TextField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const {theme} = useContext(ThemeContext);

    return (
        <input
            ref={ref}
            {...props}
            className={`w-full ${theme === 'dark' ? 'bg-[#1C1C1E] text-white' : 'bg-gray-300 text-black'} rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none ${props.className}`}
            onFocus={(e) => {
                toggleKeys(false);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={(e) => {
                toggleKeys(true);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    )
});
export const TextareaField = forwardRef<HTMLInputElement, any>((props, ref) => {
    const {theme} = useContext(ThemeContext);

    return (
        <textarea
            ref={ref}
            {...props}
            className={`w-full h-full resize-none my-4 ${theme === 'dark' ? 'bg-[#1C1C1E] text-white' : 'bg-gray-300 text-black'} rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none ${props.className}`}
            onFocus={(e) => {
                toggleKeys(false);
                if (props.onFocus) {
                    props.onFocus(e);
                }
            }}
            onBlur={(e) => {
                toggleKeys(true);
                if (props.onBlur) {
                    props.onBlur(e);
                }
            }}
        />
    )
});

export const InputBase: React.FC<any> = forwardRef((props, ref) => (
  <input
    ref={ref}
    {...props}
    onFocus={(e) => {
      toggleKeys(false);
      if (props.onFocus) {
        props.onFocus(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />
));
