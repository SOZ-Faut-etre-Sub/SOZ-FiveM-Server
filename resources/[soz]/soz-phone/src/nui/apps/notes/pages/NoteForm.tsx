import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { Button } from '@ui/old_components/Button';
import { TextareaField, TextField } from '@ui/old_components/Input';
import cn from 'classnames';
import React, { useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useNotes } from '../../../hooks/app/useNotes';
import { useConfig } from '../../../hooks/usePhone';
import { SaveIcon } from '../../../ui/assets/save';
import { useNotesAPI } from '../hooks/useNotesAPI';

interface IFormInputs {
    title: string;
    content: string;
}

export const NoteForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const config = useConfig();

    const { getNote } = useNotes();
    const note = getNote(parseInt(id));

    const { addNewNote, deleteNote, updateNote } = useNotesAPI();
    const [t] = useTranslation();

    const { register, setValue, watch, handleSubmit } = useForm<IFormInputs>();
    const onSubmit = handleSubmit(() => {});

    useLayoutEffect(() => {
        if (note) {
            setValue('title', note.title);
            setValue('content', note.content);
        }
    }, [note]);

    const isNewNote = !note;

    const handleDeleteNote = () => {
        deleteNote({ id: note.id })
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

    const handleNewNote = () => {
        addNewNote({ title: watch('title'), content: watch('content') })
            .then(() => {
                navigate(-1);
            })
            .catch(console.error);
    };

    const NoteActions = (
        <div className="flex">
            {!isNewNote && (
                <Button
                    className="flex items-center w-full text-red-400 py-2 hover:text-red-500"
                    onClick={handleDeleteNote}
                >
                    <TrashIcon className="mr-5 h-5 w-5" />
                </Button>
            )}
            <Button
                className={cn('flex items-center w-full py-2', {
                    'text-ios-100 hover:text-ios-200': config.theme.value === 'dark',
                    'text-ios-700 hover:text-ios-600': config.theme.value === 'light',
                })}
                disabled={watch('title')?.length <= 0}
                onClick={isNewNote ? handleNewNote : handleUpdateNote}
            >
                <SaveIcon className="h-5 w-5" />
            </Button>
        </div>
    );

    return (
        <Transition
            appear={true}
            show={true}
            as="div"
            className="absolute z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppTitle title={t('APPS_NOTES')} isBigHeader={false} action={NoteActions}>
                <Link to="/notes" className="flex items-center text-base">
                    <ChevronLeftIcon className="h-5 w-5" />
                    Fermer
                </Link>
            </AppTitle>
            <AppContent scrollable={false}>
                <form className="h-full" onSubmit={onSubmit}>
                    <TextField
                        {...register('title', { required: true, maxLength: 128 })}
                        placeholder={t('GENERIC.TITLE')}
                        maxLength={128}
                    />
                    <TextareaField
                        className="h-[90%]"
                        {...register('content', { required: true, maxLength: 1024 })}
                        placeholder={t('GENERIC.CONTENT')}
                        maxLength={1024}
                    />
                </form>
            </AppContent>
        </Transition>
    );
};
