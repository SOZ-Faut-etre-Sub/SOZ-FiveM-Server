import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { PhoneConfig } from '../../../../../shared/phone/config';
import { defaultConfig } from './default.constant';

const configAtom = atomWithStorage<PhoneConfig>('soz_phone_settings', defaultConfig);

const themeConfigAtom = atom(get => get(configAtom).theme.value);
const frameConfigAtom = atom(get => get(configAtom).frame.value);
const wallpaperConfigAtom = atom(get => get(configAtom).wallpaper.value);
const planeModeAtom = atom(get => get(configAtom).planeMode);
const zoomAtom = atom(get => get(configAtom).zoom.value);
const handsFreeAtom = atom(get => get(configAtom).handsFree);
const hidePicturesAtom = atom(get => get(configAtom).hidePictures);
const textZoomAtom = atom(get => get(configAtom).textZoom.value);
const dynamicAlertAtom = atom(get => get(configAtom).dynamicAlert);
const dynamicAlertDurationAtom = atom(get => get(configAtom).dynamicAlertDuration.value);

export const useConfig = () => useAtomValue(configAtom);
export const useSetConfig = () => useSetAtom(configAtom);

export const useThemeConfig = () => useAtomValue(themeConfigAtom);
export const useFrameConfig = () => useAtomValue(frameConfigAtom);
export const useWallpaperConfig = () => useAtomValue(wallpaperConfigAtom);
export const useZoomConfig = () => useAtomValue(zoomAtom);
export const usePlaneMode = () => useAtomValue(planeModeAtom);
export const useHandsFreeConfig = () => useAtomValue(handsFreeAtom);
export const useHidePicturesConfig = () => useAtomValue(hidePicturesAtom);
export const useTextZoomConfig = () => useAtomValue(textZoomAtom);
export const useDynamicAlertConfig = () => useAtomValue(dynamicAlertAtom);
export const useDynamicAlertDurationConfig = () => useAtomValue(dynamicAlertDurationAtom);
