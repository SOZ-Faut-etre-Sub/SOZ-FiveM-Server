import {Button, Slide, Paper, Typography, Container, Box} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import useStyles from './modal.styles';
import {useTranslation} from 'react-i18next';
import {TextField} from '@ui/components/Input';
import {useModalVisible, useSelectedNote} from '../hooks/state';
import {useHistory, useLocation} from 'react-router';
import {useApps} from '@os/apps/hooks/useApps';
import {useNotesAPI} from '../hooks/useNotesAPI';
import {ArrowBackIos, Delete, Save} from "@mui/icons-material";

export const NoteModal: React.FC = () => {
    const classes = useStyles();
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
        <Slide
            direction="left"
            in={modalVisible}
            mountOnEnter
            unmountOnExit
            onExited={handleClearContent}
        >
            <Paper className={classes.modalRoot} square>
                <Container>
                    <Box>
                        <Box py={2} display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                                color="primary"
                                size="large"
                                startIcon={<ArrowBackIos fontSize="large"/>}
                                onClick={_handleClose}
                            >
                                {t('APPS_NOTES')}
                            </Button>
                            <Box>
                                {isNewNote ? (
                                    <Button
                                        color="primary"
                                        disabled={noteTitle.length <= 0}
                                        onClick={handleNewNote}
                                    >
                                        <Save />
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            color="primary"
                                            onClick={handleUpdateNote}
                                            disabled={noteTitle.length <= 0}
                                        >
                                            <Save />
                                        </Button>
                                        <Button color="error" onClick={handleDeleteNote}>
                                            <Delete />
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <TextField
                            className={classes.input}
                            maxRows={1}
                            label={t('GENERIC.TITLE')}
                            inputProps={{
                                className: classes.inputPropsTitle,
                                maxLength: 25,
                            }}
                            fullWidth
                            value={noteTitle}
                            onChange={handleTitleChange}
                        />
                        <TextField
                            className={classes.input}
                            inputProps={{
                                className: classes.inputPropsContent,
                                maxLength: 250,
                            }}
                            label={t('GENERIC.CONTENT')}
                            multiline
                            fullWidth
                            rows={24}
                            variant="outlined"
                            value={noteContent}
                            onChange={handleContentChange}
                        />
                        <Typography paragraph style={{textAlign: "center"}}>{noteContent.length}/250</Typography>
                    </Box>
                </Container>
            </Paper>
        </Slide>
    );
};
