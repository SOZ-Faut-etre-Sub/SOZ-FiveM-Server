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
    SettingItemSlider,
    SettingSwitch,
} from './SettingItem';
import {useTranslation} from 'react-i18next';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Wallpaper,
    Phone,
    ZoomIn,
    VolumeUp,
    DeleteForever,
    ChevronRight, VolumeDown, Notifications,
} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Avatar as MuiAvatar, Button, Divider, ListItem, ListItemText, ListSubheader} from '@mui/material';
import {useCustomWallpaperModal, useResetSettings, useSettings, useSettingsAPI} from '../hooks/useSettings';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {IContextMenuOption} from '@ui/components/ContextMenu';
import WallpaperModal from './WallpaperModal';
import {deleteQueryFromLocation} from "@common/utils/deleteQueryFromLocation";
import {useQueryParams} from "@common/hooks/useQueryParams";
import {useHistory, useLocation} from "react-router-dom";
import qs from "qs";

const useStyles = makeStyles({
    backgroundModal: {
        background: 'black',
        opacity: '0.6',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
    },
    avatar: {
        height: '80px',
        width: '80px',
    },
    button: {
        color: 'white',
        textTransform: 'inherit',
        "&:hover": {
            background: 'transparent'
        }
    },
    subheader: {
        lineHeight: '1rem',
        paddingTop: '2rem',
        paddingBottom: '0.5rem',
        textTransform: 'uppercase',
        fontWeight: 300,
    },
    listBackground: {
        margin: '0 .5rem',
        borderRadius: '.7rem',
        background: 'rgba(0,0,0,.15)',
        ':after': {
            content: "",
            position: "absolute",
            width : "100%",
            height: "100%",
            background: "inherit",
            filter: "blur(15px)",
        }
    }
});

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

    const handleSettingChange = (key: string | number, value: unknown) => {
        setSettings({...settings, [key]: value});
    };

    const SubHeaderComp = (props: { text: string }) => (
        <ListSubheader className={classes.subheader} component="div" disableSticky>
            {props.text}
        </ListSubheader>
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
    const classes = useStyles();

    useEffect(() => {
        if (!query.image) return;

        updateProfilePicture({number: myNumber, url: query.image})
        history.replace(deleteQueryFromLocation({pathname, search}, 'image'));
    }, [query.image, updateProfilePicture, myNumber, history, pathname, search]);

    return (
        <AppWrapper>
            <AppTitle app={settingsApp}/>
            {/* Used for picking and viewing a custom wallpaper */}
            <WallpaperModal/>
            <div className={customWallpaperState ? classes.backgroundModal : undefined}/>
            <AppContent
                backdrop={isMenuOpen}
                onClickBackdrop={closeMenu}
                display="flex"
                style={{
                    height: 'auto',
                }}
            >
                <List childrenClassName={classes.listBackground} disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.PROFILE')}/>}>
                    <ListItem>
                        <ListItemText primary={<MuiAvatar className={classes.avatar} src={myAvatar}/>}/>

                        <Button className={classes.button} onClick={handleChooseImage}>
                            {t('MARKETPLACE.CHOOSE_IMAGE')}
                            <ChevronRight color="action"/>
                        </Button>
                    </ListItem>
                    <SettingItem
                        label={t('SETTINGS.PHONE_NUMBER')}
                        value={myNumber}
                        icon={<Phone/>}
                        color={'#40cb56'}
                    />
                </List>
                <List childrenClassName={classes.listBackground} disablePadding subheader={<SubHeaderComp text={t('SETTINGS.OPTIONS.RINGTONE')}/>}>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.RINGTONE')}
                        value={settings.ringtone.label}
                        options={ringtones}
                        onClick={openMenu}
                        icon={<VolumeUp/>}
                        color={'#ee1039'}
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.RINGTONE_VOLUME')}
                        iconStart={<VolumeDown/>}
                        iconEnd={<VolumeUp/>}
                        value={settings.ringtoneVol}
                        onCommit={(e, val) => handleSettingChange('ringtoneVol', val)}
                    />
                </List>
                <List childrenClassName={classes.listBackground} disablePadding subheader={<SubHeaderComp text={t('SETTINGS.OPTIONS.NOTIFICATION')}/>}>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.NOTIFICATION')}
                        value={settings.notiSound.label}
                        options={notifications}
                        onClick={openMenu}
                        icon={<Notifications/>}
                        color={'#e5440a'}
                    />
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
                        iconStart={<VolumeDown/>}
                        iconEnd={<VolumeUp/>}
                        value={settings.notiSoundVol}
                        onCommit={(e, val) => handleSettingChange('notiSoundVol', val)}
                    />
                </List>
                <List childrenClassName={classes.listBackground} disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.APPEARANCE')}/>}>
                    {/*<SettingItem*/}
                    {/*    label={t('SETTINGS.OPTIONS.THEME')}*/}
                    {/*    value={settings.theme.label}*/}
                    {/*    options={themes}*/}
                    {/*    onClick={openMenu}*/}
                    {/*    icon={<Brush/>}*/}
                    {/*    color={'#333546'}*/}
                    {/*/>*/}
                    {/*<Divider component="li"/>*/}
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.WALLPAPER')}
                        value={settings.wallpaper.label}
                        options={[...wallpapers, customWallpaper]}
                        onClick={openMenu}
                        icon={<Wallpaper/>}
                        color={'#23319b'}
                    />
                    {/*<Divider component="li"/>*/}
                    {/*<SettingItem*/}
                    {/*    label={t('SETTINGS.OPTIONS.FRAME')}*/}
                    {/*    value={settings.frame.label}*/}
                    {/*    options={frames}*/}
                    {/*    onClick={openMenu}*/}
                    {/*    icon={<Smartphone/>}*/}
                    {/*    color={'#bd4012'}*/}
                    {/*/>*/}
                    <Divider component="li"/>
                    <SettingItem
                        label={t('SETTINGS.OPTIONS.ZOOM')}
                        value={settings.zoom.label}
                        options={zoomOptions}
                        onClick={openMenu}
                        icon={<ZoomIn/>}
                        color={'#429b21'}
                    />
                </List>
                <List childrenClassName={classes.listBackground} disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.ACTIONS')}/>}>
                    <SettingSwitch
                        label={t('SETTINGS.OPTIONS.STREAMER_MODE.TITLE')}
                        secondary={t('SETTINGS.OPTIONS.STREAMER_MODE.DESCRIPTION')}
                        icon={<VisibilityOffIcon/>}
                        color={'#c41515'}
                        value={settings.streamerMode}
                        onClick={(curr) => handleSettingChange('streamerMode', !curr)}
                    />
                    <SettingItem
                        label=""
                        value={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
                        icon={<DeleteForever/>}
                        color={'#f11f1f'}
                        onClick={openMenu}
                        options={resetSettingsOpts}
                    />
                </List>
            </AppContent>
            <ContextMenu/>
        </AppWrapper>
    );
};
