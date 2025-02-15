import { Transition } from '@headlessui/react';
import { PhotographIcon } from '@heroicons/react/solid';
import { animated, useSpring } from '@react-spring/web';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAssetPath } from '../../../../../hook/assets';
import { DialogForm } from '../../../components/DialogForm';
import { TextField } from '../../../components/Input';
import { List } from '../../../components/List';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useWallpaperConfig } from '../../../system/config/config.atom';
import { wallpaperOptions } from '../../../system/config/config.constant';
import { useSettingsChange } from '../../../system/config/hooks/useSettingsChange';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';
import { SettingItem } from '../components/SettingItem';

export const SettingsWallpaper = () => {
    const { t } = useTranslation();

    const { addNotification } = useNotifications();
    const { handleSettingChange } = useSettingsChange();

    const { getPath } = useAssetPath();
    const wallpaper = useWallpaperConfig();

    const [wallpaperModal, setWallpaperModal] = useState(false);
    const [value, setValue] = useState(wallpaper ? wallpaper : '');
    const navigate = useNavigate();

    const isImageAndUrl = url => {
        return /^(http(s?):)([/|.\w\s-]).*/g.test(url);
    };

    const handleNewWallpaper = local => {
        if (local !== undefined || isImageAndUrl(value)) {
            handleSettingChange('wallpaper', {
                label: local.label || t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE'),
                value: local.value || value,
            });

            addNotification({
                app: 'settings',
                title: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_SUCCESS'),
            });

            setWallpaperModal(false);
            navigate(-1);
        } else {
            addNotification({ app: 'settings', title: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_ERROR') });
        }
    };

    useAppTitleGetBackUpdater(() => navigate(-1));

    const styles = useSpring({
        from: {
            opacity: 0,
            transform: 'translateY(100%)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0%)',
        },
    });

    return (
        <AppWrapper scrollable>
            <AppTitle title="Fond d'écran" isBigHeader={false} />
            <AppContent>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
                        onClick={() => setWallpaperModal(true)}
                        icon={<PhotographIcon />}
                        color="bg-[#8E8E92]"
                    />
                </List>
                <animated.div style={styles} className="grid gap-2 grid-cols-2 mx-2">
                    {wallpaperOptions.map(wallpaper => (
                        <div
                            key={wallpaper.value}
                            className="bg-cover bg-center w-5/6 aspect-[9/19] justify-self-center rounded-lg cursor-pointer"
                            style={{
                                backgroundImage: `url(${getPath(`images/phone/backgrounds/${wallpaper.value}`)})`,
                            }}
                            onClick={() => handleNewWallpaper(wallpaper)}
                        />
                    ))}
                </animated.div>
            </AppContent>

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
        </AppWrapper>
    );
};
