import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useApps } from '@os/apps/hooks/useApps';
import { AddNoteExportData, NotesEvents } from '@typings/app/notes';
import qs from 'qs';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNoteListener = () => {
    const { getApp } = useApps();
    const navigate = useNavigate();

    const addNoteExportHandler = useCallback(
        (noteData: AddNoteExportData) => {
            const { path } = getApp('NOTES');
            const queryStr = qs.stringify(noteData);

            navigate({
                pathname: path,
                search: `?${queryStr}`,
            });
        },
        [history, getApp]
    );

    useNuiEvent('NOTES', NotesEvents.ADD_NOTE_EXPORT, addNoteExportHandler);
};
