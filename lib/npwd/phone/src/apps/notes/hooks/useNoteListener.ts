import { AddNoteExportData, NotesEvents } from '@typings/notes';
import { useApps } from '@os/apps/hooks/useApps';
import { useHistory } from 'react-router';
import qs from 'qs';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useCallback } from 'react';

export const useNoteListener = () => {
  const { getApp } = useApps();
  const history = useHistory();

  const addNoteExportHandler = useCallback(
    (noteData: AddNoteExportData) => {
      const { path } = getApp('NOTES');
      const queryStr = qs.stringify(noteData);

      history.push({
        pathname: path,
        search: `?${queryStr}`,
      });
    },
    [history, getApp],
  );

  useNuiEvent('NOTES', NotesEvents.ADD_NOTE_EXPORT, addNoteExportHandler);
};
