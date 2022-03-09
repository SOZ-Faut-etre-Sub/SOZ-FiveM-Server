import React, {useContext, useEffect} from 'react';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import {AppTitle} from '@ui/components/AppTitle';
import {useApp} from '@os/apps/hooks/useApps';
import NoteList from './list/NoteList';
import {NoteModal} from './modal/NoteModal';
import {Route} from 'react-router-dom';
import {useModalVisible, useNotesValue, useSetModalVisible, useSetSelectedNote} from './hooks/state';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import {useQueryParams} from '@common/hooks/useQueryParams';
import {AddNoteExportData} from '@typings/notes';
import {Transition} from '@headlessui/react';
import {PencilAltIcon} from "@heroicons/react/solid";
import {ThemeContext} from "../../styles/themeProvider";

export const NotesApp: React.FC = () => {
    const notesApp = useApp('NOTES');
    const notes = useNotesValue();
    const setSelectedNote = useSetSelectedNote();
    const [isModalVisible] = useModalVisible();
    const setModalVisible = useSetModalVisible();
    const {theme} = useContext(ThemeContext);

    const onClickCreate = () => {
        setSelectedNote({title: '', content: ''});
        setModalVisible(true);
    };

    const {title, content} = useQueryParams<AddNoteExportData>({title: '', content: ''});

    useEffect(() => {
        // Althought this interface kinda blows for readability,
        // whenever we have
        if (title || content) {
            setModalVisible(true);
            setSelectedNote({title, content});
        } else {
            setModalVisible(false);
            setSelectedNote(null);
        }
    }, [setModalVisible, title, content, setSelectedNote]);

    return (
        <>
            <NoteModal/>
            <AppWrapper>
                <AppTitle app={notesApp}/>
                <AppContent className="flex-grow mt-6 mb-4">
                    <React.Suspense fallback={<LoadingSpinner/>}>
                        <Route path="/notes" component={NoteList}/>
                    </React.Suspense>
                </AppContent>
                <Transition
                    appear={true}
                    show={!isModalVisible}
                    unmount={false}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >
                    <div className="grid grid-cols-3 items-center font-light text-sm mx-5 mb-10 z-0">
                        <p className={`col-start-2 ${theme === 'dark' ? 'text-white' : 'text-black'} text-center`}>{notes.length} note{notes.length > 1 && 's'}</p>
                        <PencilAltIcon className="text-yellow-500 place-self-end cursor-pointer w-10 h-10" onClick={onClickCreate}/>
                    </div>
                </Transition>
            </AppWrapper>
        </>
    );
};
