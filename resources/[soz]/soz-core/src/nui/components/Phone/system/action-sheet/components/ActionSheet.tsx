import { animated, useSpring } from '@react-spring/web';
import { useAtom, useAtomValue } from 'jotai';
import React, { FunctionComponent } from 'react';

import { ItemIcon } from '../../../components/ItemIcon';
import { actionSheetOpenedAtom, actionSheetOptionsAtom } from '../action.sheet.atom';
import { ActionSheetContainer } from './ActionSheetContainer';
import { ActionSheetItem, ActionSheetTitle } from './ActionSheetItems';

export const ActionSheet: FunctionComponent = () => {
    const [open, setOpen] = useAtom(actionSheetOpenedAtom);
    const options = useAtomValue(actionSheetOptionsAtom);
    // const sound = useSoundProvider();

    const styles = useSpring({
        from: {
            opacity: 0,
            transform: 'translateY(100%)',
        },
        to: {
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0%)' : 'translateY(100%)',
        },
    });

    const onClose = () => setOpen(false);

    if (!open) {
        return null;
    }

    return (
        <animated.div style={styles} className="absolute bottom-10 inset-x-5 flex flex-col gap-2 z-50">
            <ActionSheetContainer>
                <ActionSheetTitle>Configuration</ActionSheetTitle>

                {options.map(option => (
                    <ActionSheetItem
                        key={option.key || option.label}
                        selected={option.selected}
                        onClick={e => {
                            if (option.soundPreview) {
                                // sound.stop(`media/${option.soundPreview}/${option.key}.mp3`);
                            }
                            option.onClick(e, option);
                            onClose();
                        }}
                        onMouseEnter={() => {
                            if (option.soundPreview) {
                                // sound.play(`media/${option.soundPreview}/${option.key}.mp3`, 0.1, false);
                            }
                        }}
                        onMouseLeave={() => {
                            if (option.soundPreview) {
                                // sound.stop(`media/${option.soundPreview}/${option.key}.mp3`);
                            }
                        }}
                    >
                        {option.icon && <ItemIcon color="transparent" icon={option.icon} />}
                        {option.label}
                    </ActionSheetItem>
                ))}
            </ActionSheetContainer>

            <ActionSheetContainer>
                <ActionSheetItem bold onClick={onClose}>
                    Fermer
                </ActionSheetItem>
            </ActionSheetContainer>
        </animated.div>
    );
};
