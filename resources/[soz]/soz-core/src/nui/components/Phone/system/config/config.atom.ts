import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { defaultConfig } from './default.constant';

const configAtom = atomWithStorage('soz_settings', defaultConfig);

const themeConfigAtom = atom(get => get(configAtom).theme.value);
const frameConfigAtom = atom(get => get(configAtom).frame.value);
const wallpaperConfigAtom = atom(get => get(configAtom).wallpaper.value);
const planeModeAtom = atom(get => get(configAtom).planeMode);
const zoomAtom = atom(get => get(configAtom).zoom.value);
const handsFreeAtom = atom(get => get(configAtom).handsFree);

export const useConfig = () => useAtomValue(configAtom);
export const useSetConfig = () => useSetAtom(configAtom);

export const useThemeConfig = () => useAtomValue(themeConfigAtom);
export const useFrameConfig = () => useAtomValue(frameConfigAtom);
export const useWallpaperConfig = () => useAtomValue(wallpaperConfigAtom);
export const useZoomConfig = () => useAtomValue(zoomAtom);
export const usePlaneMode = () => useAtomValue(planeModeAtom);
export const useHandsFreeConfig = () => useAtomValue(handsFreeAtom);
