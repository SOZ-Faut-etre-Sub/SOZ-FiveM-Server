import { useCallback } from 'react';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Society, SocietyEvents, PreDBSociety } from '@typings/society';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

export const useContactsAPI = () => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const history = useHistory();

  const sendSocietyMessage = useCallback(
    ({ number, message, position }: PreDBSociety, referral: string) => {
      fetchNui<ServerPromiseResp<Society>>(SocietyEvents.SEND_SOCIETY_MESSAGE, {
        number,
        message,
        position
      }).then((serverResp) => {
        if (serverResp.status !== 'ok') {
          return addAlert({
            message: t('SOCIETY_CONTACTS.FEEDBACK.SEND_FAILED'),
            type: 'error',
          });
        }

        // Sanity checks maybe?
        addAlert({
          message: t('SOCIETY_CONTACTS.FEEDBACK.SEND_SUCCESS'),
          type: 'success',
        });
        history.replace(referral);
      });
    },
    [addAlert, history, t],
  );

  return { sendSocietyMessage };
};
