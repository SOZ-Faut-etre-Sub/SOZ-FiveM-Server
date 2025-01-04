import { PropsWithChildren } from 'react';

export interface IAlert extends PropsWithChildren {
    title: string;
    content: string;
    onSubmit: () => void;
    onClose?: () => void;
}
