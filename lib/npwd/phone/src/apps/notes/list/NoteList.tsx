import React from 'react';
import {useNotesValue, useSetModalVisible} from '../hooks/state';
import {useSetSelectedNote} from '../hooks/state';
import {NoteItem} from '@typings/notes';
import {useTranslation} from 'react-i18next';
import { ListItem } from '@ui/components/ListItem';
import { List } from '@ui/components/List';


// TODO: add search bar later
const NoteList = () => {
    const notes = useNotesValue();
    const setNote = useSetSelectedNote();
    const [t] = useTranslation();
    const setModalVisible = useSetModalVisible();

    const handleNoteModal = (note: NoteItem) => {
        setNote(note);
        setModalVisible(true);
    };

    if (notes && notes.length)
        return (
            <List disablePadding>
                {notes.map((note, id) => (
                    <>
                        <ListItem key={note.id} button onClick={() => handleNoteModal(note)}>
                            <div>{note.title}</div>
                        </ListItem>
                        {notes.length-1 !== id && <div />}
                    </>
                ))}
            </List>
        );

    return (
        <div>
            <div color="inherit" style={{fontWeight: 300}}>
                {t('NOTES.FEEDBACK.NO_NOTES')}
            </div>
        </div>
    );
};

export default NoteList;
