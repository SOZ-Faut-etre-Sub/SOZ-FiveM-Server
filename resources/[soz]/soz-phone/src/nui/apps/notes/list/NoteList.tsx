import { ChevronRightIcon } from '@heroicons/react/outline';
import { NoteItem } from '@typings/app/notes';
import { Button } from '@ui/old_components/Button';
import { List } from '@ui/old_components/List';
import { ListItem } from '@ui/old_components/ListItem';
import cn from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '../../../styles/themeProvider';
import { useNotesValue, useSetModalVisible } from '../hooks/state';
import { useSetSelectedNote } from '../hooks/state';

// TODO: add search bar later
const NoteList = () => {
    const notes = useNotesValue();
    const setNote = useSetSelectedNote();
    const [t] = useTranslation();
    const setModalVisible = useSetModalVisible();
    const { theme } = useContext(ThemeContext);

    const handleNoteModal = (note: NoteItem) => {
        setNote(note);
        setModalVisible(true);
    };

    if (notes && notes.length)
        return (
            <List>
                {notes.map(note => (
                    <ListItem key={note.id} onClick={() => handleNoteModal(note)}>
                        <p className="flex-grow ml-4 py-2">{note.title}</p>
                        <Button className="flex items-center">
                            <ChevronRightIcon className="text-white text-opacity-25 w-5 h-5" />
                        </Button>
                    </ListItem>
                ))}
            </List>
        );

    return (
        <div
            className={cn('flex flex-col justify-center items-center h-full', {
                'text-dark': theme === 'light',
                'text-white': theme === 'dark',
            })}
        >
            {t('NOTES.FEEDBACK.NO_NOTES')}
        </div>
    );
};

export default NoteList;
