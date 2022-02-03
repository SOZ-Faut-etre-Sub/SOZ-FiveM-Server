import React from 'react';
import {useNotesValue, useSetModalVisible} from '../hooks/state';
import {useSetSelectedNote} from '../hooks/state';
import {NoteItem} from '@typings/notes';
import {useTranslation} from 'react-i18next';
import { ListItem } from '@ui/components/ListItem';
import { List } from '@ui/components/List';
import {ChevronRightIcon} from "@heroicons/react/outline";
import {Button} from "@ui/components/Button";


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
            <List>
                {notes.map((note, id) => (
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
        <div className="flex flex-col justify-center items-center text-white h-full">
            {t('NOTES.FEEDBACK.NO_NOTES')}
        </div>
    );
};

export default NoteList;
