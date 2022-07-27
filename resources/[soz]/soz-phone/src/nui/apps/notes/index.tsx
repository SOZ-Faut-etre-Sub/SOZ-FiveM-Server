import { useQueryParams } from '@common/hooks/useQueryParams';
import { Transition } from '@headlessui/react';
import { PencilAltIcon } from '@heroicons/react/solid';
import { useApp } from '@os/apps/hooks/useApps';
import { AddNoteExportData } from '@typings/app/notes';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ThemeContext } from '../../styles/themeProvider';
import { useBackground } from '../../ui/hooks/useBackground';
import { useModalVisible, useNotesValue, useSetModalVisible, useSetSelectedNote } from './hooks/state';
import NoteList from './list/NoteList';
import { NoteModal } from './modal/NoteModal';

export const NotesApp: React.FC = () => {
    const notesApp = useApp('notes');
    const notes = useNotesValue();
    const setSelectedNote = useSetSelectedNote();
    const [isModalVisible] = useModalVisible();
    const setModalVisible = useSetModalVisible();
    const { theme } = useContext(ThemeContext);
    const backgroundClass = useBackground();

    const onClickCreate = () => {
        setSelectedNote({ title: '', content: '' });
        setModalVisible(true);
    };

    const { title, content } = useQueryParams<AddNoteExportData>({ title: '', content: '' });

    useEffect(() => {
        // Althought this interface kinda blows for readability,
        // whenever we have
        if (title || content) {
            setModalVisible(true);
            setSelectedNote({ title, content });
        } else {
            setModalVisible(false);
            setSelectedNote(null);
        }
    }, [setModalVisible, title, content, setSelectedNote]);

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[35%_10%] duration-500"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[35%_10%] duration-500"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <NoteModal />
                <AppWrapper>
                    <AppTitle app={notesApp} />
                    <AppContent className="flex flex-col justify-between" scrollable={false}>
                        <Routes>
                            <Route index element={<NoteList />} />
                        </Routes>
                        <Transition
                            appear={true}
                            show={!isModalVisible}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-y-full"
                            enterTo="translate-y-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-y-0"
                            leaveTo="translate-y-full"
                        >
                            <div className="grid grid-cols-3 items-center font-light text-sm mx-5 mb-10 z-0">
                                <p
                                    className={`col-start-2 ${
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    } text-center`}
                                >
                                    {notes.length} note{notes.length > 1 && 's'}
                                </p>
                                <PencilAltIcon
                                    className="text-yellow-500 place-self-end cursor-pointer w-10 h-10"
                                    onClick={onClickCreate}
                                />
                            </div>
                        </Transition>
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
