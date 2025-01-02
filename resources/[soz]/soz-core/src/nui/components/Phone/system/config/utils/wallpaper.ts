import { wallpaperOptions } from '../config.constant';

export const isDefaultWallpaper = (value: string) => wallpaperOptions.some(wallpaper => wallpaper.value === value);
