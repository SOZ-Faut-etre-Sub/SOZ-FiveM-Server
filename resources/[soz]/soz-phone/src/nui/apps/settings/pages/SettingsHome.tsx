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
import qs from 'qs';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useQueryParams } from '../../../common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '../../../common/utils/deleteQueryFromLocation';
import { usePhoneConfig } from '../../../config/hooks/usePhoneConfig';
import { useAvatar, usePhoneNumber } from '../../../hooks/useSimCard';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useSnackbar } from '../../../os/snackbar/hooks/useSnackbar';
import { ThemeContext } from '../../../styles/themeProvider';
import { AppContent } from '../../../ui/components/AppContent';
import { AppTitle } from '../../../ui/components/AppTitle';
import { MapSettingItem, SettingOption, useContextMenu } from '../../../ui/hooks/useContextMenu';
import { Button } from '../../../ui/old_components/Button';
import { IContextMenuOption } from '../../../ui/old_components/ContextMenu';
import { List } from '../../../ui/old_components/List';
import { ListItem } from '../../../ui/old_components/ListItem';
import { SettingItem, SettingItemSlider, SettingSwitch } from '../components/SettingItem';
import { useSettings, useSettingsAPI } from '../hooks/useSettings';

export const SettingsHome = () => {
    const settingsApp = useApp('settings');
    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    const config = usePhoneConfig();
    const myNumber = usePhoneNumber();
    const myAvatar = useAvatar();
    const [settings, setSettings] = useSettings();
    const [t] = useTranslation();
    const { addAlert } = useSnackbar();
    const query = useQueryParams();
    const { updateProfilePicture } = useSettingsAPI();

    const { theme, updateTheme } = useContext(ThemeContext);
    const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();

    const handleSettingChange = (key: string | number, value: any) => {
        setSettings({ ...settings, [key]: value });

        if (key === 'theme') {
            updateTheme(value.value);
        }
    };
    // const frames = config.frames.map(
    //     MapSettingItem(settings.frame, (val: SettingOption) => handleSettingChange('frame', val)),
    // );
    const themes = config.themes.map(
        MapSettingItem(settings.theme, (val: SettingOption) => handleSettingChange('theme', val))
    );
    const zoomOptions = config.zoomOptions.map(
        MapSettingItem(settings.zoom, (val: SettingOption) => handleSettingChange('zoom', val))
    );
    const ringtones = config.ringtones.map(
        MapSettingItem(settings.ringtone, (val: SettingOption) => handleSettingChange('ringtone', val))
    );
    const notifications = config.notiSounds.map(
        MapSettingItem(settings.notiSound, (val: SettingOption) => handleSettingChange('notiSound', val))
    );

    const handleResetOptions = () => {
        setSettings(config.defaultSettings);
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
                        <div
                            className={`${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            } bg-cover bg-center h-20 w-20 my-1 rounded-full`}
                            style={{ backgroundImage: `url(${myAvatar})` }}
                        />
                        <Button
                            className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-black'} text-sm`}
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
                        value={settings.ringtone.label}
                        options={ringtones}
                        onClick={openMenu}
                        icon={<VolumeUpIcon />}
                        color="bg-[#ee1039]"
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.RINGTONE_VOLUME')}
                        iconStart={<VolumeOffIcon />}
                        iconEnd={<VolumeUpIcon />}
                        value={settings.ringtoneVol}
                        onCommit={e => handleSettingChange('ringtoneVol', parseInt(e.target.value))}
                    />
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.NOTIFICATION')}
                        value={settings.notiSound.label}
                        options={notifications}
                        onClick={openMenu}
                        icon={<BellIcon />}
                        color="bg-[#EA4E3D]"
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
                        iconStart={<VolumeOffIcon />}
                        iconEnd={<VolumeUpIcon />}
                        value={settings.notiSoundVol}
                        onCommit={e => handleSettingChange('notiSoundVol', parseInt(e.target.value))}
                    />
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.THEME')}
                        value={settings.theme.label}
                        options={themes}
                        onClick={openMenu}
                        icon={<PencilIcon />}
                        color="bg-[#8E8E92]"
                    />

                    <SettingItem
                        label={t('SETTINGS.OPTIONS.WALLPAPER')}
                        value={settings.wallpaper.label}
                        onClick={() => navigate('/settings/wallpaper')}
                        icon={<PhotographIcon />}
                        color="bg-[#8E8E92]"
                    />

                    <SettingItem
                        label={t('SETTINGS.OPTIONS.ZOOM')}
                        value={settings.zoom.label}
                        options={zoomOptions}
                        onClick={openMenu}
                        icon={<AdjustmentsIcon />}
                        color="bg-[#5756CE]"
                    />
                </List>
                <List>
                    <SettingSwitch
                        label={t('SETTINGS.OPTIONS.STREAMER_MODE.DESCRIPTION')}
                        icon={<EyeOffIcon />}
                        color="bg-[#c41515]"
                        value={settings.streamerMode}
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
