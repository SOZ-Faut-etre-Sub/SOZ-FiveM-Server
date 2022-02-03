import React, { forwardRef } from 'react';
import { PhoneEvents } from '@typings/phone';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';

export const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(PhoneEvents.TOGGLE_KEYS, {
    keepGameFocus,
  }).catch((e) => (isEnvBrowser() ? () => {} : console.error(e)));

export const TextField = forwardRef<HTMLInputElement, any>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full bg-black bg-opacity-50 text-white rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none"
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
export const TextareaField = forwardRef<HTMLInputElement, any>((props, ref) => (
  <textarea
    ref={ref}
    {...props}
    className="w-full h-full my-4 bg-black bg-opacity-50 text-white rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none"
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
