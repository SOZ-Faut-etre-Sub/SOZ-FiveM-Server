import clsx from 'clsx';
import React, { FunctionComponent, MouseEvent, PropsWithChildren } from 'react';

import { useThemeConfig } from '../system/config/config.atom';
import { Button } from './Button';

interface DialogFormProps extends PropsWithChildren {
    title: string;
    content: string;
    handleClose: (event: MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const DialogForm: FunctionComponent<DialogFormProps> = ({ children, handleClose, onSubmit, title, content }) => {
    const theme = useThemeConfig();

    return (
        <div
            className={clsx('text-center rounded-[.8rem] mx-10', {
                'bg-ios-800 bg-opacity-75 text-white': theme === 'dark',
                'bg-white bg-opacity-75 text-black': theme === 'light',
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
