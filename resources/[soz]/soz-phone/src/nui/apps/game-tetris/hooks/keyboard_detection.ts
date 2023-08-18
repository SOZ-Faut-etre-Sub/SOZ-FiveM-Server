import key from 'keymaster';
import React from 'react';

import { Action } from '../components/Game';

export type KeyboardMap = Record<string, Action>;

export const useKeyboardControls = (keyboardMap: KeyboardMap, dispatch: React.Dispatch<Action>): void => {
    React.useEffect(() => {
        const keyboardDispatch = Object.entries(keyboardMap).reduce<KeyboardDispatch>((output, [key, action]) => {
            output[key] = () => dispatch(action);
            return output;
        }, {});
        addKeyboardEvents(keyboardDispatch);
        return () => removeKeyboardEvents(keyboardDispatch);
    }, [keyboardMap, dispatch]);
};

function addKeyboardEvents(keyboardMap: KeyboardDispatch) {
    Object.keys(keyboardMap).forEach((k: keyof KeyboardDispatch) => {
        const fn = keyboardMap[k];
        if (fn) {
            key(k, fn);
        }
    });
}
function removeKeyboardEvents(keyboardMap: KeyboardDispatch) {
    Object.keys(keyboardMap).forEach(k => {
        key.unbind(k);
    });
}

type KeyboardDispatch = Record<string, () => void>;
