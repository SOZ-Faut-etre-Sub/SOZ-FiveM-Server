import { ChevronRightIcon } from '@heroicons/react/outline';
import { NoteItem } from '@typings/app/notes';
import { AppContent } from '@ui/components/AppContent';
import { Button } from '@ui/old_components/Button';
import { List } from '@ui/old_components/List';
import { ListItem } from '@ui/old_components/ListItem';
import cn from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useNotes } from '../../../hooks/app/useNotes';
import { useApp } from '../../../os/apps/hooks/useApps';
import { ThemeContext } from '../../../styles/themeProvider';
import { AppTitle } from '../../../ui/components/AppTitle';

// TODO: add search bar later
const NoteList = () => {
    const notesApp = useApp('notes');
    const { getNotes } = useNotes();

    const notes = getNotes();
    const navigate = useNavigate();
    const [t] = useTranslation();
    const { theme } = useContext(ThemeContext);

    const handleNoteModal = (note: NoteItem) => {
        navigate(`/notes/${note.id}`);
    };

    if (notes && notes.length)
        return (
            <AppContent className="flex flex-col" scrollable={false}>
                <AppTitle app={notesApp} />
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
            </AppContent>
        );

    return (
        <AppContent className="flex flex-col justify-between" scrollable={false}>
            <div
                className={cn('flex flex-col justify-center items-center h-full', {
                    'text-dark': theme === 'light',
                    'text-white': theme === 'dark',
                })}
            >
                {t('NOTES.FEEDBACK.NO_NOTES')}
            </div>
        </AppContent>
    );
};

export default NoteList;
