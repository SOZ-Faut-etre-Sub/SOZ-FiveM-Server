import cn from 'classnames';
import React, { FunctionComponent, memo } from 'react';

import { useConfig } from '../../../hooks/usePhone';
import { Button } from '../../../ui/old_components/Button';

export const PhoneModal: FunctionComponent = memo(() => {
    const config = useConfig();

    const title = 'title';
    const content = 'content';
    const handleClose = () => {};
    const onSubmit = () => {};
    const children = 'children';

    return (
        <div
            className={cn('absolute z-50 inset-10', {
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
});
