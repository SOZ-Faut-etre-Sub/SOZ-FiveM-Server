import React, {useCallback, useEffect} from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {useContextMenu, MapSettingItem, SettingOption} from '@ui/hooks/useContextMenu';
import {usePhoneConfig} from '../../../config/hooks/usePhoneConfig';
import {List} from '@ui/components/List';
import {useMyPhoneNumber, useMyPictureProfile} from '@os/simcard/hooks/useMyPhoneNumber';
import {useApp} from '@os/apps/hooks/useApps';
import {
    SettingItem,
    SettingItemSlider, SettingSwitch,
} from './SettingItem';
import {useTranslation} from 'react-i18next';
import {useCustomWallpaperModal, useResetSettings, useSettings, useSettingsAPI} from '../hooks/useSettings';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {IContextMenuOption} from '@ui/components/ContextMenu';
import {deleteQueryFromLocation} from "@common/utils/deleteQueryFromLocation";
import {useQueryParams} from "@common/hooks/useQueryParams";
import {useHistory, useLocation} from "react-router-dom";
import qs from "qs";
import { ListItem } from '@ui/components/ListItem';
import { useInView } from 'react-intersection-observer';
import { Button } from '@ui/components/Button';
import {Transition} from "@headlessui/react";
import {
    ChevronRightIcon,
    VolumeOffIcon,
    BellIcon,
    PhoneIcon,
    VolumeUpIcon,
    AdjustmentsIcon,
    PhotographIcon,
    EyeOffIcon,
    TrashIcon
} from "@heroicons/react/solid";


export const SettingsApp = () => {
    const settingsApp = useApp('SETTINGS');
    const [config] = usePhoneConfig();
    const myNumber = useMyPhoneNumber();
    const myAvatar = useMyPictureProfile();
    const [settings, setSettings] = useSettings();
    const [t] = useTranslation();
    const [customWallpaperState, setCustomWallpaperState] = useCustomWallpaperModal();
    const {addAlert} = useSnackbar();
    const query = useQueryParams();
    const {pathname, search} = useLocation();
    const history = useHistory();
    const {updateProfilePicture} = useSettingsAPI();

    const resetSettings = useResetSettings();

    const [inViewRef, inView] = useInView({
        triggerOnce: true
    });

    const handleSettingChange = (key: string | number, value: unknown) => {
        setSettings({...settings, [key]: value});
    };

    const SubHeaderComp = (props: { text: string }) => (
        <div>
            {props.text}
        </div>
    );

    const wallpapers = config.wallpapers.map(
        MapSettingItem(settings.wallpaper, (val: SettingOption) =>
            handleSettingChange('wallpaper', val),
        ),
    );
    // const frames = config.frames.map(
    //     MapSettingItem(settings.frame, (val: SettingOption) => handleSettingChange('frame', val)),
    // );
    // const themes = config.themes.map(
    //     MapSettingItem(settings.theme, (val: SettingOption) => handleSettingChange('theme', val)),
    // );
    const zoomOptions = config.zoomOptions.map(
        MapSettingItem(settings.zoom, (val: SettingOption) => handleSettingChange('zoom', val)),
    );
    const ringtones = config.ringtones.map(
        MapSettingItem(settings.ringtone, (val: SettingOption) => handleSettingChange('ringtone', val)),
    );
    const notifications = config.notiSounds.map(
        MapSettingItem(settings.notiSound, (val: SettingOption) =>
            handleSettingChange('notiSound', val),
        ),
    );

    const handleResetOptions = () => {
        resetSettings();
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

    const customWallpaper: IContextMenuOption = {
        selected: false,
        onClick: () => setCustomWallpaperState(true),
        key: 'CUSTOM_WALLPAPER',
        label: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE'),
    };

    const handleChooseImage = useCallback(() => {
        history.push(
            `/camera?${qs.stringify({
                referal: encodeURIComponent(pathname + search),
            })}`,
        );
    }, [history, pathname, search]);

    const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();

    useEffect(() => {
        if (!query.image) return;

        updateProfilePicture({number: myNumber, url: query.image})
        history.replace(deleteQueryFromLocation({pathname, search}, 'image'));
    }, [query.image, updateProfilePicture, myNumber, history, pathname, search]);

    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[20%_20%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[20%_20%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <ContextMenu/>
            <AppWrapper>
                <AppTitle app={settingsApp} isBigHeader={inView}/>
                {/*<WallpaperModal/>*/}
                {/*<div className={customWallpaperState ? classes.backgroundModal : undefined}/>*/}
                <AppContent className="mt-6 mb-4" backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
                    <List>
                        <ListItem>
                            <div className="bg-cover bg-center h-20 w-20 my-1 rounded-full" style={{backgroundImage: `url(${myAvatar})`}} />
                            <Button className="flex items-center text-white text-sm" onClick={handleChooseImage}>
                                {t('MARKETPLACE.CHOOSE_IMAGE')}
                                <ChevronRightIcon className="text-opacity-25 w-6 h-6" />
                            </Button>
                        </ListItem>
                    </List>
                    <List>
                        <SettingItem
                            label={t('SETTINGS.PHONE_NUMBER')}
                            value={myNumber}
                            icon={<PhoneIcon/>}
                            color='bg-[#65C466]'
                        />
                    </List>
                    <List>
                        <SettingItem
                            label={t('SETTINGS.OPTIONS.RINGTONE')}
                            value={settings.ringtone.label}
                            options={ringtones}
                            onClick={openMenu}
                            icon={<VolumeUpIcon/>}
                            color='bg-[#ee1039]'
                        />
                        <SettingItemSlider
                            label={t('SETTINGS.OPTIONS.RINGTONE_VOLUME')}
                            iconStart={<VolumeOffIcon/>}
                            iconEnd={<VolumeUpIcon/>}
                            value={settings.ringtoneVol}
                            onCommit={e => handleSettingChange('ringtoneVol', e.target.value)}
                        />
                    </List>
                    <List>
                        <SettingItem
                            label={t('SETTINGS.OPTIONS.NOTIFICATION')}
                            value={settings.notiSound.label}
                            options={notifications}
                            onClick={openMenu}
                            icon={<BellIcon/>}
                            color='bg-[#EA4E3D]'
                        />
                        <SettingItemSlider
                            label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
                            iconStart={<VolumeOffIcon/>}
                            iconEnd={<VolumeUpIcon/>}
                            value={settings.notiSoundVol}
                            onCommit={e => handleSettingChange('notiSoundVol', e.target.value)}
                        />
                    </List>
                    <List>
                        <SettingItem
                            label={t('SETTINGS.OPTIONS.WALLPAPER')}
                            value={settings.wallpaper.label}
                            options={[...wallpapers, customWallpaper]}
                            onClick={openMenu}
                            icon={<PhotographIcon/>}
                            color='bg-[#8E8E92]'
                        />

                        {/*<Divider component="li"/>*/}
                        <SettingItem
                            label={t('SETTINGS.OPTIONS.ZOOM')}
                            value={settings.zoom.label}
                            options={zoomOptions}
                            onClick={openMenu}
                            icon={<AdjustmentsIcon/>}
                            color='bg-[#5756CE]'
                        />
                    </List>
                    <List>
                        <SettingSwitch
                            label={t('SETTINGS.OPTIONS.STREAMER_MODE.TITLE')}
                            secondary={t('SETTINGS.OPTIONS.STREAMER_MODE.DESCRIPTION')}
                            icon={<EyeOffIcon/>}
                            color='bg-[#c41515]'
                            value={settings.streamerMode}
                            onClick={(curr) => handleSettingChange('streamerMode', !curr)}
                        />
                        <SettingItem
                            label=""
                            value={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
                            icon={<TrashIcon/>}
                            color='bg-[#f11f1f]'
                            onClick={openMenu}
                            options={resetSettingsOpts}
                        />
                    </List>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
