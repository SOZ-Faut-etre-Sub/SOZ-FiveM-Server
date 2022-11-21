import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { Button } from '@ui/old_components/Button';
import { ItemIcon } from '@ui/old_components/ItemIcon';
import React from 'react';

import { useSoundProvider } from '../../os/sound/hooks/useSoundProvider';
import { AppContent } from '../components/AppContent';
import { useBackground } from '../hooks/useBackground';
import { List } from './List';
import { ListItem } from './ListItem';

export interface IContextMenuOption {
    onClick(e, option): void;

    label: string;
    description?: string;
    selected?: boolean;
    icon?: JSX.Element;
    key?: string;
    soundPreview?: boolean;
}

interface ContextMenuProps {
    open: boolean;
    onClose: () => void;
    options: Array<IContextMenuOption>;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ open, onClose, options }) => {
    const backgroundClass = useBackground();
    const sound = useSoundProvider();

    return (
        <Transition
            appear={true}
            show={open}
            className="absolute inset-x-0 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppWrapper className={backgroundClass}>
                <AppTitle title="Configuration">
                    {onClose && (
                        <Button className="flex items-center text-base" onClick={onClose}>
                            <ChevronLeftIcon className="h-5 w-5" />
                            Fermer
                        </Button>
                    )}
                </AppTitle>
                <AppContent className="mt-4 mb-4">
                    <List>
                        {options.map(option => (
                            <ListItem
                                selected={option.selected}
                                key={option.key || option.label}
                                button
                                onClick={e => {
                                    option.onClick(e, option);
                                    onClose();
                                }}
                                onMouseEnter={() => {
                                    if (option.soundPreview) {
                                        sound.play(`/media/${option.soundPreview}/${option.key}.mp3`, 0.1, false);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (option.soundPreview) {
                                        sound.stop(`/media/${option.soundPreview}/${option.key}.mp3`);
                                    }
                                }}
                            >
                                <ItemIcon color="transparent" icon={option.icon} />
                                <p className="flex-grow ml-4 font-light normal-case">{option.label}</p>
                                <Button className="flex items-center">
                                    <ChevronRightIcon className="text-white text-opacity-25 w-5 h-5" />
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
