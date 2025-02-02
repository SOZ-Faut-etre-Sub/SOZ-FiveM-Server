import { ChatAltIcon, PaperAirplaneIcon } from '@heroicons/react/outline';
import {
    AdjustmentsIcon,
    BellIcon,
    ChevronRightIcon,
    DeviceMobileIcon,
    EyeOffIcon,
    PencilIcon,
    PhoneIcon,
    PhotographIcon,
    TrashIcon,
    VolumeOffIcon,
    VolumeUpIcon,
} from '@heroicons/react/solid';
import { SettingOption } from '@public/shared/phone/config';
import clsx from 'clsx';
import qs from 'qs';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../../components/Button';
import { ContactPicture } from '../../../components/ContactPicture';
import { List, ListItem } from '../../../components/List';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { IActionSheetOption } from '../../../system/action-sheet/action.sheet.types';
import { useActionSheet } from '../../../system/action-sheet/hooks/useActionSheet';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useConfig } from '../../../system/config/config.atom';
import {
    dynamicAlertDurationOptions,
    frameOptions,
    notiSoundOptions,
    ringtoneOptions,
    textZoomOptions,
    themeOptions,
    zoomOptions,
} from '../../../system/config/config.constant';
import { useSettingsChange } from '../../../system/config/hooks/useSettingsChange';
import { useAvatar } from '../../../system/sim-card/hooks/useAvatar';
import { useSimCard } from '../../../system/sim-card/hooks/useSimCard';
import { useSocietySimCard } from '../../../system/sim-card/hooks/useSocietySimCard';
import { SettingItem } from '../components/SettingItem';
import { SettingItemSlider } from '../components/SettingItemSlider';
import { SettingSwitch } from '../components/SettingItemSwitch';
import { MapAudioSettingItem, MapSettingItem } from '../utils/mapper';

export const SettingsHome = () => {
    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    const settingsApp = useApp('settings');
    const { t } = useTranslation();

    const { canUseDynamicAlerts } = useSocietySimCard();
    const { number } = useSimCard();

    const config = useConfig();

    const { avatar } = useAvatar();

    const { openActionSheet } = useActionSheet();
    const { handleSettingChange, resetSettings } = useSettingsChange();

    const mappedThemes = themeOptions.map(
        MapSettingItem(config.theme, (val: SettingOption) => handleSettingChange('theme', val))
    );
    const mappedDynamicAlertDurationOptions = dynamicAlertDurationOptions.map(
        MapSettingItem(config.dynamicAlertDuration, (val: SettingOption) =>
            handleSettingChange('dynamicAlertDuration', val)
        )
    );
    const mappedFrameOptions = frameOptions.map(
        MapSettingItem(config.frame, (val: SettingOption) => handleSettingChange('frame', val))
    );
    const mappedZoomOptions = zoomOptions.map(
        MapSettingItem(config.zoom, (val: SettingOption) => handleSettingChange('zoom', val))
    );
    const mappedTextZoomOptions = textZoomOptions.map(
        MapSettingItem(config.textZoom, (val: SettingOption) => handleSettingChange('textZoom', val))
    );
    const mappedRingtones = ringtoneOptions.map(
        MapAudioSettingItem(config.ringtone, (val: SettingOption) => handleSettingChange('ringtone', val), 'ringtones')
    );
    const mappedNotifications = notiSoundOptions.map(
        MapAudioSettingItem(
            config.notiSound,
            (val: SettingOption) => handleSettingChange('notiSound', val),
            'notifications'
        )
    );
    const mappedSocietyNotifications = notiSoundOptions.map(
        MapAudioSettingItem(
            config.notiSound,
            (val: SettingOption) => handleSettingChange('societyNotification', val),
            'notifications'
        )
    );

    const resetSettingsOpts: IActionSheetOption[] = [
        {
            selected: false,
            onClick: () => resetSettings(),
            key: 'RESET_SETTINGS',
            label: t('SETTINGS.OPTIONS.RESET_SETTINGS'),
        },
    ];

    const handleChooseImage = useCallback(() => {
        navigate(
            `/photos?${qs.stringify({
                referral: encodeURIComponent(pathname + '/avatar' + search),
            })}`
        );
    }, [navigate, pathname, search]);

    return (
        <AppWrapper scrollable>
            <AppTitle app={settingsApp} />
            <AppContent>
                <List>
                    <ListItem className="px-2">
                        <ContactPicture picture={avatar} size={'large'} />
                        <Button
                            className={clsx('flex items-center text-sm', {
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
                        value={number}
                        icon={<PhoneIcon />}
                        color="bg-[#65C466]"
                    />
                    <SettingSwitch
                        label={t('SETTINGS.OPTIONS.HAND_FREE')}
                        icon={<DeviceMobileIcon />}
                        color="bg-[#ac5de8]"
                        value={config.handsFree}
                        onClick={curr => handleSettingChange('handsFree', !curr)}
                    />
                    <SettingSwitch
                        label={t('SETTINGS.OPTIONS.PLANE_MODE')}
                        icon={<PaperAirplaneIcon />}
                        color="bg-[#FF6633]"
                        value={config.planeMode}
                        onClick={curr => handleSettingChange('planeMode', !curr)}
                    />
                </List>
                {canUseDynamicAlerts && (
                    <>
                        <List>
                            <SettingSwitch
                                label={t('SETTINGS.OPTIONS.DYNAMIC_ALERTS')}
                                icon={<BellIcon />}
                                color="bg-orange-500"
                                value={config.dynamicAlert}
                                onClick={curr => handleSettingChange('dynamicAlert', !curr)}
                            />
                            <SettingItem
                                label={t('SETTINGS.OPTIONS.DYNAMIC_ALERTS_DURATION')}
                                value={config.dynamicAlertDuration.label}
                                options={mappedDynamicAlertDurationOptions}
                                onClick={openActionSheet}
                                icon={<AdjustmentsIcon />}
                                color="bg-[#5756CE]"
                            />
                            <SettingItemSlider
                                label={t('SETTINGS.OPTIONS.DYNAMIC_ALERTS_VOLUME')}
                                iconStart={<VolumeOffIcon />}
                                iconEnd={<VolumeUpIcon />}
                                value={config.dynamicAlertVol}
                                onCommit={e => handleSettingChange('dynamicAlertVol', parseInt(e.target.value))}
                            />
                        </List>
                    </>
                )}
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.RINGTONE')}
                        value={config.ringtone.label}
                        options={mappedRingtones}
                        onClick={openActionSheet}
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
                        options={mappedNotifications}
                        onClick={openActionSheet}
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
                        options={mappedSocietyNotifications}
                        onClick={openActionSheet}
                        icon={<BellIcon />}
                        color="bg-[#3d71ea]"
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
                        iconStart={<VolumeOffIcon />}
                        iconEnd={<VolumeUpIcon />}
                        value={config.societyNotificationVol}
                        onCommit={e => handleSettingChange('societyNotificationVol', parseInt(e.target.value))}
                    />
                </List>
                <List>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.THEME')}
                        value={config.theme.label}
                        options={mappedThemes}
                        onClick={openActionSheet}
                        icon={<PencilIcon />}
                        color="bg-[#8E8E92]"
                    />

                    <SettingItem
                        label={t('SETTINGS.OPTIONS.FRAME')}
                        value={config.frame.label}
                        options={mappedFrameOptions}
                        onClick={openActionSheet}
                        icon={<PhotographIcon />}
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
                        options={mappedZoomOptions}
                        onClick={openActionSheet}
                        icon={<AdjustmentsIcon />}
                        color="bg-[#5756CE]"
                    />

                    <SettingItem
                        label={t('SETTINGS.OPTIONS.TEXT_ZOOM')}
                        value={config.textZoom.label}
                        options={mappedTextZoomOptions}
                        onClick={openActionSheet}
                        icon={<ChatAltIcon />}
                        color="bg-[#5756CE]"
                    />
                </List>
                <List>
                    <SettingSwitch
                        label={t('SETTINGS.OPTIONS.HIDE_PICTURES.DESCRIPTION')}
                        icon={<EyeOffIcon />}
                        color="bg-[#c41515]"
                        value={config.hidePictures}
                        onClick={curr => handleSettingChange('hidePictures', !curr)}
                    />
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
                        icon={<TrashIcon />}
                        color="bg-[#f11f1f]"
                        onClick={openActionSheet}
                        options={resetSettingsOpts}
                    />
                </List>
            </AppContent>
        </AppWrapper>
    );
};
