import React, {useState} from 'react';
import {useCustomWallpaperModal, useSettings} from '../hooks/useSettings';
import {useTranslation} from 'react-i18next';
import DialogForm from '../../../ui/components/DialogForm';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {TextField} from '@ui/components/Input';
import {AppWrapper} from "@ui/components";
import {AppTitle} from "@ui/components/AppTitle";
import {Button} from "@ui/components/Button";
import {ChevronLeftIcon} from "@heroicons/react/outline";
import {AppContent} from "@ui/components/AppContent";
import {List} from "@ui/components/List";
import {Transition} from "@headlessui/react";
import {usePhoneConfig} from "../../../config/hooks/usePhoneConfig";
import getBackgroundPath from "../utils/getBackgroundPath";
import {SettingItem} from "./SettingItem";
import {PhotographIcon} from "@heroicons/react/solid";

const WallpaperModal: React.FC = () => {
    const [customWallpaperModal, setCustomWallpaperModal] = useCustomWallpaperModal();
    const [wallpaperModal, setWallpaperModal] = useState(false);
    const [settings, setSettings] = useSettings();
    const [t] = useTranslation();
    const [value, setValue] = useState(settings.wallpaper.value ? settings.wallpaper.value : '');
    const {addAlert} = useSnackbar();
    const [config] = usePhoneConfig();

    const isImageAndUrl = (url) => {
        return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
    };

    const handleSettingChange = (key: string | number, value: unknown) => {
        setSettings({...settings, [key]: value});
    };

    const handleNewWallpaper = (local) => {
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
            addAlert({message: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_ERROR'), type: 'error'});
        }
    };

    return (
        <>
            <Transition
                appear={true}
                show={customWallpaperModal}
                unmount={false}
                className="absolute inset-x-0 z-40"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
                style={{ willChange: 'transform,opacity' }}
            >
                <AppWrapper>
                    <AppTitle title="Fond d'écran" isBigHeader={false}>
                        <Button className="flex items-center text-base" onClick={() => setCustomWallpaperModal(false)}>
                            <ChevronLeftIcon className="h-5 w-5"/>
                            Fermer
                        </Button>
                    </AppTitle>
                    <AppContent className="mt-8 mb-4 h-[780px] overflow-scroll">
                        <List>
                            <SettingItem
                                label={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
                                onClick={() => setWallpaperModal(true)}
                                icon={<PhotographIcon/>}
                                color='bg-[#8E8E92]'
                            />
                        </List>
                        <div className="grid gap-2 grid-cols-2 mx-2">
                            {config.wallpapers && config.wallpapers.map(wallpaper =>
                                <div key={wallpaper.value} className="bg-cover bg-center w-5/6 aspect-[9/19] justify-self-center rounded-lg cursor-pointer"
                                     style={{backgroundImage: `url(${getBackgroundPath(wallpaper.value)})`}}
                                     onClick={() => handleNewWallpaper(wallpaper)}
                                />
                            )}
                        </div>
                    </AppContent>
                </AppWrapper>
            </Transition>
            <Transition
                appear={true}
                show={wallpaperModal}
                unmount={false}
                className="absolute top-[45%] z-40"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="scale-0"
                enterTo="scale-100"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="scale-100"
                leaveTo="scale-0"
            >
                <DialogForm
                    open={wallpaperModal}
                    handleClose={() => setWallpaperModal(false)}
                    onSubmit={handleNewWallpaper}
                    title={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
                    content={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_CONTENT')}
                >
                    <TextField
                        value={value}
                        onChange={(e) => !isImageAndUrl(value) && setValue(e.currentTarget.value)}
                        placeholder={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_PLACEHOLDER')}
                    />
                </DialogForm>
            </Transition>
        </>
    );
};

export default WallpaperModal;
