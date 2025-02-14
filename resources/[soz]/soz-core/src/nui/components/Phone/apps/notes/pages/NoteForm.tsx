import { TrashIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import SaveIcon from '../../../assets/save.svg';
import { TextareaField, TextField } from '../../../components/Input';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useAlert } from '../../../system/alerts/hooks/useAlert';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useNotesAPI } from '../hooks/useNotesAPI';
import { useNotes } from '../notes.atom';

interface IFormInputs {
    title: string;
    content: string;
}

export const NoteForm: FunctionComponent = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { t } = useTranslation();
    const theme = useThemeConfig();
    const { sendAlert } = useAlert();

    const notes = useNotes();
    const note = notes.find(n => n.id === parseInt(id));
    const isNewNote = !note;

    const { register, setValue, watch, handleSubmit } = useForm<IFormInputs>();
    const onSubmit = handleSubmit(() => {});

    const { addNewNote, deleteNote, updateNote } = useNotesAPI();

    const handleNewNote = () => {
        addNewNote({ title: watch('title'), content: watch('content') })
            .then(() => {
                navigate(-1);
            })
            .catch(console.error);
    };

    const handleUpdateNote = () => {
        updateNote({ id: note.id, title: watch('title'), content: watch('content') })
            .then(() => {
                navigate(-1);
            })
            .catch(console.error);
    };

    const handleDeleteNote = () => {
        sendAlert('Supprimer la note ?', 'Cette action est irréversible.', () => {
            deleteNote(note.id)
                .then(() => {
                    navigate(-1);
                })
                .catch(console.error);
        });
    };

    useAppTitleGetBackUpdater(() => navigate('/notes'), 'Notes');
    useAppTitleActionsUpdater([
        {
            display: !isNewNote,
            icon: <TrashIcon className="size-5" />,
            className: 'text-red-400 hover:text-red-500',
            onClick: handleDeleteNote,
        },
        {
            display: note?.title?.length > 0 || watch('title')?.length > 0,
            icon: <SaveIcon className="size-5" />,
            className: {
                'text-ios-100 hover:text-ios-200': theme === 'dark',
                'text-ios-700 hover:text-ios-600': theme === 'light',
            },
            onClick: isNewNote ? handleNewNote : handleUpdateNote,
        },
    ]);

    useLayoutEffect(() => {
        if (!note) return;

        setValue('title', note.title);
        setValue('content', note.content);
    }, [note]);

    return (
        <AppWrapper className="flex flex-col">
            <AppContent>
                <form className="flex flex-col gap-2 h-full" onSubmit={onSubmit}>
                    <TextField
                        {...register('title', { required: true, maxLength: 128 })}
                        placeholder={t('GENERIC.TITLE')}
                        maxLength={128}
                    />
                    <TextareaField
                        className="grow"
                        {...register('content', { required: true })}
                        placeholder={t('GENERIC.CONTENT')}
                    />
                </form>
            </AppContent>
        </AppWrapper>
    );
};
