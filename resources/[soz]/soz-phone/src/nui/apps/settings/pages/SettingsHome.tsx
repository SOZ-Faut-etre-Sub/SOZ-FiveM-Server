import { ChatAltIcon } from '@heroicons/react/outline';
import {
    AdjustmentsIcon,
    BellIcon,
    ChevronRightIcon,
    EyeOffIcon,
    PencilIcon,
    PhoneIcon,
    PhotographIcon,
    TrashIcon,
    VolumeOffIcon,
    VolumeUpIcon,
} from '@heroicons/react/solid';
import cn from 'classnames';
import qs from 'qs';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useQueryParams } from '../../../common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '../../../common/utils/deleteQueryFromLocation';
import { usePhoneConfig } from '../../../config/hooks/usePhoneConfig';
import { useConfig } from '../../../hooks/usePhone';
import { useAvatar, usePhoneNumber } from '../../../hooks/useSimCard';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useSnackbar } from '../../../os/snackbar/hooks/useSnackbar';
import { store } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import { AppTitle } from '../../../ui/components/AppTitle';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { MapSettingItem, SettingOption, useContextMenu } from '../../../ui/hooks/useContextMenu';
import { Button } from '../../../ui/old_components/Button';
import { IContextMenuOption } from '../../../ui/old_components/ContextMenu';
import { List } from '../../../ui/old_components/List';
import { ListItem } from '../../../ui/old_components/ListItem';
import { SettingItem, SettingItemSlider, SettingSwitch } from '../components/SettingItem';
import { useSettingsAPI } from '../hooks/useSettings';

export const SettingsHome = () => {
    const settingsApp = useApp('settings');
    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    const phoneConfig = usePhoneConfig();
    const myNumber = usePhoneNumber();
    const myAvatar = useAvatar();
    const config = useConfig();
    const [t] = useTranslation();
    const { addAlert } = useSnackbar();
    const query = useQueryParams();
    const { updateProfilePicture } = useSettingsAPI();

    const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();

    const handleSettingChange = (key: string | number, value: any) => {
        if (key === 'zoom') {
            if (window.innerHeight <= value.value * 10) {
                addAlert({
                    message: t('SETTINGS.ZOOM.WARNING'),
                    type: 'warning',
                });
                return;
            }
        }

        store.dispatch.phone.updateConfig({ ...config, [key]: value });
    };
    const themes = phoneConfig.themes.map(
        MapSettingItem(config.theme, (val: SettingOption) => handleSettingChange('theme', val))
    );
    const zoomOptions = phoneConfig.zoomOptions.map(
        MapSettingItem(config.zoom, (val: SettingOption) => handleSettingChange('zoom', val))
    );
    const textZoomOptions = phoneConfig.textZoomOptions.map(
        MapSettingItem(config.textZoom, (val: SettingOption) => handleSettingChange('textZoom', val))
    );
    const ringtones = phoneConfig.ringtones.map(
        MapSettingItem(config.ringtone, (val: SettingOption) => handleSettingChange('ringtone', val))
    );
    const notifications = phoneConfig.notiSounds.map(
        MapSettingItem(config.notiSound, (val: SettingOption) => handleSettingChange('notiSound', val))
    );
    const societyNotifications = phoneConfig.notiSounds.map(
        MapSettingItem(config.notiSound, (val: SettingOption) => handleSettingChange('societyNotification', val))
    );

    const handleResetOptions = () => {
        store.dispatch.phone.updateConfig(phoneConfig.defaultSettings);
        addAlert({
            message: t('SETTINGS.MESSAGES.SETTINGS_RESET'),
            type: 'success',
        });
    };

    const resetSettingsOpts: IContextMenuOption[] = [
        {
            selected: false,
            onClick: () => handleResetOptions(),
            key: 'RESET_SETTINGS',
            label: t('SETTINGS.OPTIONS.RESET_SETTINGS'),
        },
    ];

    const handleChooseImage = useCallback(() => {
        navigate(
            `/photo?${qs.stringify({
                referral: encodeURIComponent(pathname + search),
            })}`
        );
    }, [navigate, pathname, search]);

    useEffect(() => {
        if (!query.image) return;

        updateProfilePicture({ number: myNumber, url: query.image });
        navigate(deleteQueryFromLocation({ pathname, search }, 'image'), { replace: true });
    }, [query.image, updateProfilePicture, myNumber, history, pathname, search]);

    return (
        <>
            <AppTitle app={settingsApp} />
            <ContextMenu />
            <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
                <List>
                    <ListItem>
                        <ContactPicture picture={myAvatar} size={'large'} />
                        <Button
                            className={cn('flex items-center text-sm', {
                                'text-white': config.theme.value === 'dark',
                                'text-black': config.theme.value === 'light',
                            })}
                            onClick={handleChooseImage}
                        >
                            {t('MARKETPLACE.CHOOSE_IMAGE')}
                            <ChevronRightIcon className="text-gray-200 w-6 h-6" />
                        </Button>
                    </ListItem>
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.PHONE_NUMBER')}
                        value={myNumber}
                        icon={<PhoneIcon />}
                        color="bg-[#65C466]"
                    />
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.RINGTONE')}
                        value={config.ringtone.label}
                        options={ringtones}
                        onClick={openMenu}
                        icon={<VolumeUpIcon />}
                        color="bg-[#ee1039]"
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.RINGTONE_VOLUME')}
                        iconStart={<VolumeOffIcon />}
                        iconEnd={<VolumeUpIcon />}
                        value={config.ringtoneVol}
                        onCommit={e => handleSettingChange('ringtoneVol', parseInt(e.target.value))}
                    />
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.NOTIFICATION')}
                        value={config.notiSound.label}
                        options={notifications}
                        onClick={openMenu}
                        icon={<BellIcon />}
                        color="bg-[#EA4E3D]"
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
                        iconStart={<VolumeOffIcon />}
                        iconEnd={<VolumeUpIcon />}
                        value={config.notiSoundVol}
                        onCommit={e => handleSettingChange('notiSoundVol', parseInt(e.target.value))}
                    />
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.SOCIETY_NOTIFICATION')}
                        value={config.societyNotification.label}
                        options={societyNotifications}
                        onClick={openMenu}
                        icon={<BellIcon />}
                        color="bg-[#3d71ea]"
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
                        iconStart={<VolumeOffIcon />}
                        iconEnd={<VolumeUpIcon />}
                        value={config.societyNotificationVol}
                        onCommit={e => handleSettingChange('societyNotificationsVol', parseInt(e.target.value))}
                    />
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.THEME')}
                        value={config.theme.label}
                        options={themes}
                        onClick={openMenu}
                        icon={<PencilIcon />}
                        color="bg-[#8E8E92]"
                    />

                    <SettingItem
                        label={t('SETTINGS.OPTIONS.WALLPAPER')}
                        value={config.wallpaper.label}
                        onClick={() => navigate('/settings/wallpaper')}
                        icon={<PhotographIcon />}
                        color="bg-[#8E8E92]"
                    />

                    <SettingItem
                        label={t('SETTINGS.OPTIONS.ZOOM')}
                        value={config.zoom.label}
                        options={zoomOptions}
                        onClick={openMenu}
                        icon={<AdjustmentsIcon />}
                        color="bg-[#5756CE]"
                    />

                    <SettingItem
                        label={t('SETTINGS.OPTIONS.TEXT_ZOOM')}
                        value={config.textZoom.label}
                        options={textZoomOptions}
                        onClick={openMenu}
                        icon={<ChatAltIcon />}
                        color="bg-[#5756CE]"
                    />
                </List>
                <List>
                    <SettingSwitch
                        label={t('SETTINGS.OPTIONS.STREAMER_MODE.DESCRIPTION')}
                        icon={<EyeOffIcon />}
                        color="bg-[#c41515]"
                        value={config.streamerMode}
                        onClick={curr => handleSettingChange('streamerMode', !curr)}
                    />
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
                        icon={<TrashIcon />}
                        color="bg-[#f11f1f]"
                        onClick={openMenu}
                        options={resetSettingsOpts}
                    />
                </List>
            </AppContent>
        </>
    );
};
