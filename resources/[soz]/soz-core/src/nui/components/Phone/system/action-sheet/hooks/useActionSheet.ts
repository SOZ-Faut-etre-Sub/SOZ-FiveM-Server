import { useSetAtom } from 'jotai';

import { actionSheetOpenedAtom, actionSheetOptionsAtom } from '../action.sheet.atom';
import { IActionSheetOption } from '../action.sheet.types';

export const useActionSheet = () => {
    const setOpen = useSetAtom(actionSheetOpenedAtom);
    const setOptions = useSetAtom(actionSheetOptionsAtom);

    const openActionSheet = (actions: IActionSheetOption[] = []) => {
        setOpen(true);
        setOptions(actions);
    };

    const closeActionSheet = () => {
        setOpen(false);
        setOptions([]);
    };

    return {
        openActionSheet,
        closeActionSheet,
    };
};
