import React, {useCallback, useEffect} from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { useContextMenu, MapSettingItem, SettingOption } from '@ui/hooks/useContextMenu';
import { usePhoneConfig } from '../../../config/hooks/usePhoneConfig';
import { List } from '@ui/components/List';
import {useMyPhoneNumber, useMyPictureProfile} from '@os/simcard/hooks/useMyPhoneNumber';
import { IconSetObject, useApp } from '@os/apps/hooks/useApps';
import {
  SettingItem,
  SettingItemIconAction,
  SettingItemSlider,
  SettingSwitch,
} from './SettingItem';
import { useTranslation } from 'react-i18next';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Brush,
  Wallpaper,
  Phone,
  Smartphone,
  ZoomIn,
  LibraryMusic,
  VolumeUp,
  FileCopy,
  Book,
  DeleteForever,
  Apps,
} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Avatar as MuiAvatar, Box, Button, ListSubheader} from '@mui/material';
import {useCustomWallpaperModal, useResetSettings, useSettings, useSettingsAPI} from '../hooks/useSettings';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { IContextMenuOption } from '@ui/components/ContextMenu';
import WallpaperModal from './WallpaperModal';
import ImageIcon from "@mui/icons-material/Image";
import {deleteQueryFromLocation} from "@common/utils/deleteQueryFromLocation";
import {useQueryParams} from "@common/hooks/useQueryParams";
import {useHistory, useLocation} from "react-router-dom";
import qs from "qs";

const SubHeaderComp = (props: { text: string }) => (
  <ListSubheader color="primary" component="div" disableSticky>
    {props.text}
  </ListSubheader>
);

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
    margin: 'auto',
    height: '100px',
    width: '100px',
    marginBottom: 10,
  },
});

export const SettingsApp = () => {
  const settingsApp = useApp('SETTINGS');
  const [config] = usePhoneConfig();
  const myNumber = useMyPhoneNumber();
  const myAvatar = useMyPictureProfile();
  const [settings, setSettings] = useSettings();
  const [t] = useTranslation();
  const [customWallpaperState, setCustomWallpaperState] = useCustomWallpaperModal();
  const { addAlert } = useSnackbar();
  const query = useQueryParams();
  const { pathname, search } = useLocation();
  const history = useHistory();
  const { updateProfilePicture } = useSettingsAPI();

  const resetSettings = useResetSettings();

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({ ...settings, [key]: value });
  };

  const iconSets = config.iconSet.map(
    MapSettingItem(settings.iconSet, (val: SettingOption<IconSetObject>) =>
      handleSettingChange('iconSet', val),
    ),
  );

  const wallpapers = config.wallpapers.map(
    MapSettingItem(settings.wallpaper, (val: SettingOption) =>
      handleSettingChange('wallpaper', val),
    ),
  );
  const frames = config.frames.map(
    MapSettingItem(settings.frame, (val: SettingOption) => handleSettingChange('frame', val)),
  );
  const themes = config.themes.map(
    MapSettingItem(settings.theme, (val: SettingOption) => handleSettingChange('theme', val)),
  );
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

  const languages = config.languages.map(
    MapSettingItem(settings.language, (val: SettingOption) => handleSettingChange('language', val)),
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

  const handleCopyPhoneNumber = () => {
    setClipboard(myNumber);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'number',
      }),
      type: 'success',
    });
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
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query.image, history, pathname, search]);

  return (
    <AppWrapper>
      <AppTitle app={settingsApp} />
      {/* Used for picking and viewing a custom wallpaper */}
      <WallpaperModal />
      <div className={customWallpaperState ? classes.backgroundModal : undefined} />
      {/*
        Sometimes depending on the height of the app, we sometimes want it to fill its parent
        and other times we want it to grow with the content. AppContent implementation currently
        has a style of height: 100%, attached to its main class. We overwrite this here by
        passing a style prop of height: 'auto'. This isn't ideal but it works without breaking
        any of the other apps.

        This also fixes Material UI v5's background color properly
      */}
      <AppContent
        backdrop={isMenuOpen}
        onClickBackdrop={closeMenu}
        display="flex"
        style={{
          height: 'auto',
        }}
      >
        <List disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.PROFILE')} />}>
          <MuiAvatar className={classes.avatar} src={myAvatar} />
          <Box display="flex" alignItems="center" justifyContent="center">
            <ImageIcon />
            <Button onClick={handleChooseImage}>
              {t('MARKETPLACE.CHOOSE_IMAGE')}
            </Button>
          </Box>
        </List>
        <List disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.PHONE')} />}>
          <SettingItemIconAction
            label={t('SETTINGS.PHONE_NUMBER')}
            labelSecondary={myNumber}
            actionLabel={t('GENERIC.WRITE_TO_CLIPBOARD_TOOLTIP', {
              content: 'number',
            })}
            icon={<Phone />}
            actionIcon={<FileCopy />}
            handleAction={handleCopyPhoneNumber}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.RINGTONE')}
            value={settings.ringtone.label}
            options={ringtones}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <SettingItemSlider
            label={t('SETTINGS.OPTIONS.RINGTONE_VOLUME')}
            icon={<VolumeUp />}
            value={settings.ringtoneVol}
            onCommit={(e, val) => handleSettingChange('ringtoneVol', val)}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.NOTIFICATION')}
            value={settings.notiSound.label}
            options={notifications}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <SettingItemSlider
            label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
            icon={<VolumeUp />}
            value={settings.notiSoundVol}
            onCommit={(e, val) => handleSettingChange('notiSoundVol', val)}
          />
          <SettingSwitch
            label={t('SETTINGS.OPTIONS.STREAMER_MODE.TITLE')}
            secondary={t('SETTINGS.OPTIONS.STREAMER_MODE.DESCRIPTION')}
            icon={<VisibilityOffIcon />}
            value={settings.streamerMode}
            onClick={(curr) => handleSettingChange('streamerMode', !curr)}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.APPEARANCE')} />}>
          <SettingItem
            label={t('SETTINGS.OPTIONS.LANGUAGE')}
            value={settings.language.label}
            options={languages}
            onClick={openMenu}
            icon={<Book />}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.THEME')}
            value={settings.theme.label}
            options={themes}
            onClick={openMenu}
            icon={<Brush />}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.ICONSET')}
            value={settings.iconSet.label}
            options={iconSets}
            onClick={openMenu}
            icon={<Apps />}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.WALLPAPER')}
            value={settings.wallpaper.label}
            options={[...wallpapers, customWallpaper]}
            onClick={openMenu}
            icon={<Wallpaper />}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.FRAME')}
            value={settings.frame.label}
            options={frames}
            onClick={openMenu}
            icon={<Smartphone />}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.ZOOM')}
            value={settings.zoom.label}
            options={zoomOptions}
            onClick={openMenu}
            icon={<ZoomIn />}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.ACTIONS')} />}>
          <SettingItem
            label={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
            value={t('SETTINGS.OPTIONS.RESET_SETTINGS_DESC')}
            icon={<DeleteForever />}
            onClick={openMenu}
            options={resetSettingsOpts}
          />
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
