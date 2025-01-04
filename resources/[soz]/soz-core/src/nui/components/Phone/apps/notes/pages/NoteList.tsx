import { PencilAltIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList } from 'react-window';

import { NoteItem } from '../../../../../../shared/phone/apps/notes';
import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { ListItem } from '../../../components/List';
import { SearchField } from '../../../components/SearchField';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { searchQueryAtom, useNotes } from '../notes.atom';

export const NoteList = () => {
    const notesApp = useApp('notes');

    const { t } = useTranslation();
    const navigate = useNavigate();

    const theme = useThemeConfig();

    const notes = useNotes();
    const [searchValue, setSearchValue] = useAtom(searchQueryAtom);

    useAppTitleActionsUpdater([
        {
            display: true,
            icon: <PencilAltIcon className="text-yellow-500 place-self-end cursor-pointer size-5" />,
            onClick: () => navigate('/notes/new'),
        },
    ]);

    useEffect(() => {
        return () => {
            setSearchValue('');
        };
    }, []);

    return (
        <AppWrapper>
            <AppContent scrollable={false}>
                <AppTitle app={notesApp} />
                <div className="sticky top-0 z-10">
                    <SearchField onChange={e => setSearchValue(e.target.value)} value={searchValue} />
                </div>

                {notes && notes.length > 0 ? (
                    <FixedSizeList
                        height={720}
                        width={410}
                        itemSize={60}
                        itemCount={notes.length}
                        itemData={notes}
                        className="rounded-xl"
                    >
                        {NoteItem}
                    </FixedSizeList>
                ) : (
                    <div
                        className={clsx('flex flex-col justify-center items-center', {
                            'text-white': theme === 'dark',
                            'text-dark': theme === 'light',
                        })}
                    >
                        {t('NOTES.FEEDBACK.NO_NOTES')}
                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};

const NoteItem: FunctionComponent<VirtualizedListProps<NoteItem>> = ({ index, style, data }) => {
    const navigate = useNavigate();

    const note = data[index];
    if (!note) return null;

    const handleNoteModal = () => {
        navigate(`/notes/${note.id}`);
    };

    return (
        <ListItem key={note.id} style={style} onClick={handleNoteModal}>
            <div className="flex flex-col ml-2 py-2 truncate">
                <p className="flex-grow">{note.title}</p>
                <p className="flex-grow text-gray-500 truncate">{note.content.slice(0, 60)}</p>
            </div>
        </ListItem>
    );
};
