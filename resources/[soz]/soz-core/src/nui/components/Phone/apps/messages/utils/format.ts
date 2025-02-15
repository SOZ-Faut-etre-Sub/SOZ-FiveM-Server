import { isImage } from './image';
import { isPosition } from './position';

export const formatMessage = (message?: string, isEmitter?: boolean): string => {
    if (isImage(message)) {
        return `Vous avez ${isEmitter ? 'envoyé' : 'reçu'} une image`;
    }

    if (isPosition(message)) {
        return `Vous avez ${isEmitter ? 'envoyé' : 'reçu'} une position`;
    }

    return message;
};
