import { useEffect } from 'react';

import { NuiMethodMap } from '../../shared/nui';
import { useIsInInput } from './input';
import { useMenuNuiEvent } from './nui';

export const useKeyPress = (targetKey: string, onKeyPress?: () => void) => {
    const isInInput = useIsInInput();

    useEffect(() => {
        const downHandler = (event: KeyboardEvent) => {
            if (event.key === targetKey && !isInInput) {
                onKeyPress && onKeyPress();
            }
        };

        window.addEventListener('keydown', downHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
        };
    }, [targetKey, onKeyPress, isInInput]);
};

const useMenuControlNuiEvent = <M extends keyof NuiMethodMap['menu']>(
    method: M,
    handler: (r: NuiMethodMap['menu'][M]) => void
) => {
    const isInInput = useIsInInput();
    return useMenuNuiEvent(method, r => {
        if (!isInInput) {
            handler(r);
        }
    });
};

export const useControl = (onKeyPress?: () => void) => {
    useMenuControlNuiEvent('ToggleFocus', onKeyPress);
    useKeyPress('Control', onKeyPress);
};

export const useBackspace = (onKeyPress?: () => void) => {
    useMenuControlNuiEvent('Backspace', onKeyPress);
    useKeyPress('Backspace', onKeyPress);
};

export const useArrowDown = (onKeyPress: () => void) => {
    useMenuControlNuiEvent('ArrowDown', onKeyPress);
    useKeyPress('ArrowDown', onKeyPress);
};

export const useArrowUp = (onKeyPress: () => void) => {
    useMenuControlNuiEvent('ArrowUp', onKeyPress);
    useKeyPress('ArrowUp', onKeyPress);
};

export const useArrowRight = (onKeyPress: () => void) => {
    useMenuControlNuiEvent('ArrowRight', onKeyPress);
    useKeyPress('ArrowRight', onKeyPress);
};

export const useArrowLeft = (onKeyPress: () => void) => {
    useMenuControlNuiEvent('ArrowLeft', onKeyPress);
    useKeyPress('ArrowLeft', onKeyPress);
};

export const useEnter = (onKeyPress?: () => void) => {
    useMenuControlNuiEvent('Enter', onKeyPress);
    useKeyPress('Enter', onKeyPress);
};
