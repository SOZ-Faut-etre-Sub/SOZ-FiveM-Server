import { Menu, Transition } from '@headlessui/react';
import { ArrowsExpandIcon, ShareIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PictureModal } from '../../apps/messages/components/modal/PictureModal';
import { useConfig } from '../../hooks/usePhone';
import { setClipboard } from '../../os/phone/hooks/useClipboard';
import { useSnackbar } from '../../os/snackbar/hooks/useSnackbar';
import { Button } from './Button';

export const PictureReveal: React.FC<PropsWithChildren<{ image: string }>> = ({ image, children }) => {
    const settings = useConfig();
    const [covered, setCovered] = useState<boolean>(false);
    const [bigImage, setBigImage] = useState<boolean>(false);
    const [, setReady] = useState<boolean>(false);
    const [t] = useTranslation();
    const { addAlert } = useSnackbar();

    useEffect(() => {
        if (settings.streamerMode === true) {
            setCovered(true);
        }
        setReady(true);
    }, [settings.streamerMode]);

    const onClickCover = () => setCovered(false);

    const handleCopyImage = () => {
        setClipboard(image);
        addAlert({
            type: 'success',
            message: "Adresse de l'image copiée dans le presse-papier",
        });
    };

    return (
        <div className="relative" onClick={onClickCover}>
            <PictureModal open={bigImage} setOpen={setBigImage} children={children} />
            {covered && (
                <div className="relative h-full flex justify-center items-center">{t('GENERIC_CLICK_TO_REVEAL')}</div>
            )}

            <Menu as="div">
                <Menu.Button className="left-0 h-full w-full">
                    <div
                        className={cn({
                            'relative -top-[95%] left-0 h-full opacity-50 grayscale blur-md': covered,
                        })}
                    >
                        {children}
                    </div>
                </Menu.Button>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                    className="absolute z-50 top-2 right-0 w-56"
                >
                    <Menu.Items className="mt-2 origin-top-right bg-ios-800 bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                        <Menu.Item>
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={() => setBigImage(s => !s)}
                            >
                                <ArrowsExpandIcon className="mx-3 h-5 w-5" /> Agrandir
                            </Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={handleCopyImage}
                            >
                                <ShareIcon className="mx-3 h-5 w-5" /> Partager
                            </Button>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};
