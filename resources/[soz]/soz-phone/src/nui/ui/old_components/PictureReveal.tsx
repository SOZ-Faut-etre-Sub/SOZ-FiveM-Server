import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../hooks/usePhone';

export const PictureReveal: React.FC<PropsWithChildren> = ({ children }) => {
    const settings = useConfig();
    const [covered, setCovered] = useState<boolean>(false);
    const [, setReady] = useState<boolean>(false);
    const [t] = useTranslation();

    useEffect(() => {
        if (settings.streamerMode === true) {
            setCovered(true);
        }
        setReady(true);
    }, [settings.streamerMode]);

    const onClickCover = () => setCovered(false);

    return (
        <div className="relative" onClick={onClickCover}>
            {covered && (
                <div className="relative h-full flex justify-center items-center">{t('GENERIC_CLICK_TO_REVEAL')}</div>
            )}
            <div className={`${covered && 'relative -top-[95%] left-0 h-full opacity-50 grayscale blur-md'}`}>
                {children}
            </div>
        </div>
    );
};
