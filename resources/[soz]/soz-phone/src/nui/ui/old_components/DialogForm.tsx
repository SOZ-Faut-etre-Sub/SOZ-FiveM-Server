import cn from 'classnames';
import React from 'react';

import { useConfig } from '../../hooks/usePhone';
import { Button } from './Button';

interface DialogFormProps {
    children: React.ReactNode;
    handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // No idea what those types are
    onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    title: string;
    content: string;
}

const DialogForm: React.FC<DialogFormProps> = ({ children, handleClose, onSubmit, title, content }) => {
    const config = useConfig();

    return (
        <div
            className={cn('text-center rounded-[.8rem] mx-10', {
                'bg-ios-800 bg-opacity-75 text-white': config.theme.value === 'dark',
                'bg-white bg-opacity-75 text-black': config.theme.value === 'light',
            })}
        >
            <div className="pt-5 px-5">
                <div className="font-bold">{title}</div>
                <div className="text-[.9rem] py-2">{content}</div>
                <div className="py-2">{children}</div>
            </div>

            <div className="border-t border-white border-opacity-30">
                <Button className="w-2/4 p-2 text-center text-red-500" onClick={handleClose}>
                    Annuler
                </Button>
                <Button
                    className="w-2/4 p-2 text-center text-blue-500 border-l border-white border-opacity-30"
                    onClick={onSubmit}
                >
                    Valider
                </Button>
            </div>
        </div>
    );
};

export default DialogForm;
