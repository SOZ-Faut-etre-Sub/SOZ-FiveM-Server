import { atom } from 'jotai';

import { IActionSheetOption } from './action.sheet.types';

export const actionSheetOpenedAtom = atom<boolean>(false);
export const actionSheetOptionsAtom = atom<IActionSheetOption[]>([]);
