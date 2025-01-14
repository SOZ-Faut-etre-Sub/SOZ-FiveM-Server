import { atom } from 'jotai';

import { IActionSheetOption } from './action.sheet.types';

export const actionSheetTitleAtom = atom<string>('');
export const actionSheetOpenedAtom = atom<boolean>(false);
export const actionSheetOptionsAtom = atom<IActionSheetOption[]>([]);
