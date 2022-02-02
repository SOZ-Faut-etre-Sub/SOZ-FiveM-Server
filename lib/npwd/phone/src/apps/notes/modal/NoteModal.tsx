import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextField} from '@ui/components/Input';
import {useModalVisible, useSelectedNote} from '../hooks/state';
import {useHistory, useLocation} from 'react-router';
import {useApps} from '@os/apps/hooks/useApps';
import {useNotesAPI} from '../hooks/useNotesAPI';
import { Button } from '@ui/components/Button';

export const NoteModal: React.FC = () => {
    const {addNewNote, deleteNote, updateNote} = useNotesAPI();
    const [modalVisible, setModalVisible] = useModalVisible();
    const [t] = useTranslation();
    const [selectedNote, setSelectedNote] = useSelectedNote();
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');

    const history = useHistory();
    const {getApp} = useApps();
    const location = useLocation();

    const notesApp = useMemo(() => getApp('NOTES'), [getApp]);

    const isNewNote = !Boolean(selectedNote?.id);

    useEffect(() => {
        if (selectedNote !== null) {
            setNoteContent(selectedNote.content);
            setNoteTitle(selectedNote.title);
        }
    }, [selectedNote]);

    const handleDeleteNote = () => {
        deleteNote({id: selectedNote.id})
            .then(() => {
                setModalVisible(false);
            })
            .catch(console.error);
    };

    const handleUpdateNote = () => {
        updateNote({id: selectedNote.id, title: noteTitle, content: noteContent})
            .then(() => {
                setModalVisible(false);
            })
            .catch(console.error);
    };

    const handleNewNote = () => {
        addNewNote({title: noteTitle, content: noteContent})
            .then(() => {
                setModalVisible(false);
            })
            .catch(console.error);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteTitle(e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteContent(e.target.value);
    };

    const _handleClose = () => {
        setModalVisible(false);
    };

    const handleClearContent = () => {
        setSelectedNote(null);
        if (location.search) history.push(notesApp.path);
    };

    if (selectedNote === null) return null;

    return (
        <div>
            <div>
                <div>
                    <div>
                        <div >
                            <Button
                                color="primary"
                                size="large"
                                // startIcon={<ArrowBackIos fontSize="large"/>}
                                onClick={_handleClose}
                            >
                                {t('APPS_NOTES')}
                            </Button>
                            <div>
                                {isNewNote ? (
                                    <Button
                                        color="primary"
                                        disabled={noteTitle.length <= 0}
                                        onClick={handleNewNote}
                                    >
                                        {/*<Save />*/}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            color="primary"
                                            onClick={handleUpdateNote}
                                            disabled={noteTitle.length <= 0}
                                        >
                                            {/*<Save />*/}
                                        </Button>
                                        <Button color="error" onClick={handleDeleteNote}>
                                            {/*<Delete />*/}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <TextField
                            maxRows={1}
                            label={t('GENERIC.TITLE')}
                            fullWidth
                            value={noteTitle}
                            onChange={handleTitleChange}
                        />
                        <TextField
                            label={t('GENERIC.CONTENT')}
                            multiline
                            fullWidth
                            rows={24}
                            variant="outlined"
                            value={noteContent}
                            onChange={handleContentChange}
                        />
                        <div style={{textAlign: "center"}}>{noteContent.length}/250</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
