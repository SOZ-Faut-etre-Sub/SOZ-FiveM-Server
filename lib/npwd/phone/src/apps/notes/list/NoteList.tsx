import React from 'react';
import {Box, Divider, List, ListItem, ListItemText, Typography} from '@mui/material';
import {useNotesValue, useSetModalVisible} from '../hooks/state';
import {useSetSelectedNote} from '../hooks/state';
import {NoteItem} from '@typings/notes';
import {Theme} from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
    noNotes: {
        color: theme.palette.text.secondary,
    },
    notesList: {
        margin: '.5rem',
        borderRadius: '.8rem',
        background: 'rgba(255,255,255,.1)'
    }
}));

// TODO: add search bar later
const NoteList = () => {
    const classes = useStyles();
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
            <List className={classes.notesList} disablePadding>
                {notes.map((note, id) => (
                    <>
                        <ListItem key={note.id} button onClick={() => handleNoteModal(note)}>
                            <ListItemText>{note.title}</ListItemText>
                        </ListItem>
                        {notes.length-1 !== id && <Divider component="li"/>}
                    </>
                ))}
            </List>
        );

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100%"
            className={classes.noNotes}
        >
            <Typography color="inherit" variant="h6" style={{fontWeight: 300}}>
                {t('NOTES.FEEDBACK.NO_NOTES')}
            </Typography>
        </Box>
    );
};

export default NoteList;
