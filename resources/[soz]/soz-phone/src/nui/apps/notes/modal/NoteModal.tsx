import { Menu, Transition } from '@headlessui/react';
import { ChevronLeftIcon, DotsCircleHorizontalIcon, SaveIcon, TrashIcon } from '@heroicons/react/outline';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { AppContent } from '@ui/old_components/AppContent';
import { Button } from '@ui/old_components/Button';
import { TextareaField, TextField } from '@ui/old_components/Input';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBackground } from '../../../ui/hooks/useBackground';
import { FullPageWithoutHeader } from '../../../ui/layout/FullPageWithoutHeader';
import { useModalVisible, useSelectedNote } from '../hooks/state';
import { useNotesAPI } from '../hooks/useNotesAPI';

export const NoteModal: React.FC = () => {
    const { addNewNote, deleteNote, updateNote } = useNotesAPI();
    const [modalVisible, setModalVisible] = useModalVisible();
    const [t] = useTranslation();
    const [selectedNote] = useSelectedNote();
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const backgroundClass = useBackground();

    const isNewNote = !selectedNote?.id;

    useEffect(() => {
        if (selectedNote !== null) {
            setNoteContent(selectedNote.content);
            setNoteTitle(selectedNote.title);
        }
    }, [selectedNote]);

    const handleDeleteNote = () => {
        deleteNote({ id: selectedNote.id })
            .then(() => {
                setModalVisible(false);
            })
            .catch(console.error);
    };

    const handleUpdateNote = () => {
        updateNote({ id: selectedNote.id, title: noteTitle, content: noteContent })
            .then(() => {
                setModalVisible(false);
            })
            .catch(console.error);
    };

    const handleNewNote = () => {
        addNewNote({ title: noteTitle, content: noteContent })
            .then(() => {
                setModalVisible(false);
            })
            .catch(console.error);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteTitle(e.target.value);
        e.target.focus();
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteContent(e.target.value);
    };

    const _handleClose = () => {
        setModalVisible(false);
    };

    const NoteActions = (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
                <DotsCircleHorizontalIcon className="h-6 w-6" />
            </Menu.Button>
            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-black bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                    <Menu.Item>
                        <Button
                            className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                            disabled={noteTitle.length <= 0}
                            onClick={isNewNote ? handleNewNote : handleUpdateNote}
                        >
                            <SaveIcon className="mx-3 h-5 w-5" /> Sauvegarder
                        </Button>
                    </Menu.Item>
                    {!isNewNote && (
                        <Menu.Item>
                            <Button
                                className="flex items-center w-full text-red-400 px-2 py-2 hover:text-red-500"
                                onClick={handleDeleteNote}
                            >
                                <TrashIcon className="mx-3 h-5 w-5" /> Supprimer
                            </Button>
                        </Menu.Item>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );

    if (selectedNote === null) return null;

    return (
        <FullPageWithoutHeader>
            <Transition
                appear={true}
                show={modalVisible}
                as="div"
                className="absolute h-full z-40"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <AppWrapper className={cn('h-full', backgroundClass)}>
                    <AppTitle title={t('APPS_NOTES')} isBigHeader={false} action={NoteActions}>
                        <Button className="flex items-center text-base" onClick={_handleClose}>
                            <ChevronLeftIcon className="h-5 w-5" />
                            Fermer
                        </Button>
                    </AppTitle>
                    <AppContent className="mt-10 mx-4 mb-4">
                        <TextField placeholder={t('GENERIC.TITLE')} value={noteTitle} onChange={handleTitleChange} />
                        <TextareaField
                            placeholder={t('GENERIC.CONTENT')}
                            rows={22}
                            value={noteContent}
                            onChange={handleContentChange}
                        />
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithoutHeader>
    );
};
