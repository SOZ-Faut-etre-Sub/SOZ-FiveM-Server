import { useSetAtom } from 'jotai';

import { actionSheetOpenedAtom, actionSheetOptionsAtom, actionSheetTitleAtom } from '../action.sheet.atom';
import { IActionSheetOption } from '../action.sheet.types';

export const useActionSheet = () => {
    const setOpen = useSetAtom(actionSheetOpenedAtom);
    const setTitle = useSetAtom(actionSheetTitleAtom);
    const setOptions = useSetAtom(actionSheetOptionsAtom);

    const openActionSheet = (title: string, actions: IActionSheetOption[] = []) => {
        setOpen(true);
        setTitle(title);
        setOptions(actions);
    };

    const closeActionSheet = () => {
        setOpen(false);
        setTitle('');
        setOptions([]);
    };

    return {
        openActionSheet,
        closeActionSheet,
    };
};
