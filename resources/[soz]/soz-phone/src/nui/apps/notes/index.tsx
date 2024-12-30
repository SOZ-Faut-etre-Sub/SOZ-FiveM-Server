import { Transition } from '@headlessui/react';
import { PencilAltIcon } from '@heroicons/react/solid';
import { AppWrapper } from '@ui/components/AppWrapper';
import cn from 'classnames';
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useNotes } from '../../hooks/app/useNotes';
import { useConfig } from '../../hooks/usePhone';
import { AppContainer } from '../../ui/components/AppContainer';
import { AppContent } from '../../ui/components/AppContent';
import { NoteForm } from './pages/NoteForm';
import NoteList from './pages/NoteList';

export const NotesApp: React.FC = () => {
    const { getNotes } = useNotes();
    const notes = getNotes();

    const config = useConfig();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const onClickCreate = () => {
        navigate('/notes/new');
    };

    return (
        <AppContainer>
            <AppWrapper>
                <Routes>
                    <Route index element={<NoteList />} />
                    <Route path=":id" element={<NoteForm />} />
                </Routes>
            </AppWrapper>
            <AppContent className="flex flex-col justify-between" scrollable={false}>
                <Transition
                    appear={true}
                    show={pathname === '/notes'}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >
                    <div className="grid grid-cols-3 items-center font-light text-sm mx-5 mb-10 z-0">
                        <p
                            className={cn('col-start-2 text-center', {
                                'text-white': config.theme.value === 'dark',
                                'text-black': config.theme.value === 'light',
                            })}
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
        </AppContainer>
    );
};
