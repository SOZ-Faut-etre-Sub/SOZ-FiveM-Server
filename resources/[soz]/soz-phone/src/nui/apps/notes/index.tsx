import { Transition } from '@headlessui/react';
import { PencilAltIcon } from '@heroicons/react/solid';
import { AppWrapper } from '@ui/components/AppWrapper';
import React, { useContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useNotes } from '../../hooks/app/useNotes';
import { ThemeContext } from '../../styles/themeProvider';
import { AppContent } from '../../ui/components/AppContent';
import { useBackground } from '../../ui/hooks/useBackground';
import { FullPageWithHeaderWithNavBar } from '../../ui/layout/FullPageWithHeaderWithNavBar';
import { NoteForm } from './pages/NoteForm';
import NoteList from './pages/NoteList';

export const NotesApp: React.FC = () => {
    const backgroundClass = useBackground();

    const { getNotes } = useNotes();
    const notes = getNotes();

    const { theme } = useContext(ThemeContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const onClickCreate = () => {
        navigate('/notes/new');
    };

    return (
        <FullPageWithHeaderWithNavBar className={backgroundClass}>
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
                <AppWrapper>
                    <Routes>
                        <Route index element={<NoteList />} />
                        <Route path=":id" element={<NoteForm />} />
                    </Routes>
                </AppWrapper>
            </Transition>
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
                        <p className={`col-start-2 ${theme === 'dark' ? 'text-white' : 'text-black'} text-center`}>
                            {notes.length} note{notes.length > 1 && 's'}
                        </p>
                        <PencilAltIcon
                            className="text-yellow-500 place-self-end cursor-pointer w-10 h-10"
                            onClick={onClickCreate}
                        />
                    </div>
                </Transition>
            </AppContent>
        </FullPageWithHeaderWithNavBar>
    );
};
