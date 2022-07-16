import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { PhotographIcon } from '@heroicons/react/solid';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithoutHeader } from '@ui/layout/FullPageWithoutHeader';
import { AppTitle } from '@ui/old_components/AppTitle';
import { Button } from '@ui/old_components/Button';
import DialogForm from '@ui/old_components/DialogForm';
import { TextField } from '@ui/old_components/Input';
import { List } from '@ui/old_components/List';
import cn from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePhoneConfig } from '../../../config/hooks/usePhoneConfig';
import { AppContent } from '../../../ui/components/AppContent';
import { useBackground } from '../../../ui/hooks/useBackground';
import { useCustomWallpaperModal, useSettings } from '../hooks/useSettings';
import getBackgroundPath from '../utils/getBackgroundPath';
import { SettingItem } from './SettingItem';

const WallpaperModal: React.FC = () => {
    const [customWallpaperModal, setCustomWallpaperModal] = useCustomWallpaperModal();
    const [wallpaperModal, setWallpaperModal] = useState(false);
    const [settings, setSettings] = useSettings();
    const [t] = useTranslation();
    const [value, setValue] = useState(settings.wallpaper.value ? settings.wallpaper.value : '');
    const { addAlert } = useSnackbar();
    const [config] = usePhoneConfig();
    const backgroundClass = useBackground();

    const isImageAndUrl = url => {
        return /^(http(s?):)([/|.|\w|\s|-]).*/g.test(url);
    };

    const handleSettingChange = (key: string | number, value: unknown) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleNewWallpaper = local => {
        if (local !== undefined || isImageAndUrl(value)) {
            handleSettingChange('wallpaper', {
                label: local.label || t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE'),
                value: local.value || value,
            });
            addAlert({
                message: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_SUCCESS'),
                type: 'success',
            });
            setCustomWallpaperModal(false);
            setWallpaperModal(false);
        } else {
            addAlert({ message: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_ERROR'), type: 'error' });
        }
    };

    return (
        <FullPageWithoutHeader>
            <Transition
                appear={true}
                show={customWallpaperModal}
                className="absolute inset-x-0 z-40"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <AppWrapper className={cn('h-full', backgroundClass)}>
                    <AppTitle title="Fond d'écran" isBigHeader={false}>
                        <Button className="flex items-center text-base" onClick={() => setCustomWallpaperModal(false)}>
                            <ChevronLeftIcon className="h-5 w-5" />
                            Fermer
                        </Button>
                    </AppTitle>
                    <AppContent>
                        <List>
                            <SettingItem
                                label={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
                                onClick={() => setWallpaperModal(true)}
                                icon={<PhotographIcon />}
                                color="bg-[#8E8E92]"
                            />
                        </List>
                        <div className="grid gap-2 grid-cols-2 mx-2">
                            {config.wallpapers &&
                                config.wallpapers.map(wallpaper => (
                                    <div
                                        key={wallpaper.value}
                                        className="bg-cover bg-center w-5/6 aspect-[9/19] justify-self-center rounded-lg cursor-pointer"
                                        style={{ backgroundImage: `url(${getBackgroundPath(wallpaper.value)})` }}
                                        onClick={() => handleNewWallpaper(wallpaper)}
                                    />
                                ))}
                        </div>
                    </AppContent>
                </AppWrapper>
            </Transition>
            <Transition
                appear={true}
                show={wallpaperModal}
                className="absolute top-[45%] z-40"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="scale-0"
                enterTo="scale-100"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="scale-100"
                leaveTo="scale-0"
            >
                <DialogForm
                    handleClose={() => setWallpaperModal(false)}
                    onSubmit={handleNewWallpaper}
                    title={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
                    content={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_CONTENT')}
                >
                    <TextField
                        value={value}
                        onChange={e => setValue(e.currentTarget.value)}
                        placeholder={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_PLACEHOLDER')}
                    />
                </DialogForm>
            </Transition>
        </FullPageWithoutHeader>
    );
};

export default WallpaperModal;
