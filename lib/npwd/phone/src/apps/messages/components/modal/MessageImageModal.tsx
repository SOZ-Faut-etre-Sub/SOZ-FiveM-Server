import React, { useCallback, useEffect, useMemo, useState } from 'react';
import qs from 'qs';
import Modal from '../../../../ui/components/Modal';
import { Box, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { ContextMenu } from '@ui/components/ContextMenu';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {MessageEvents} from "@typings/messages";
import {useSnackbar} from "@os/snackbar/hooks/useSnackbar";

interface IProps {
  isOpen: boolean;
  messageGroupId: string | undefined;

  onClose(): void;

  image?: string;
}

export const MessageImageModal = ({ isOpen, messageGroupId, onClose, image }: IProps) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const { addAlert } = useSnackbar();
  const [queryParamImagePreview, setQueryParamImagePreview] = useState(null);
  const { sendMessage } = useMessageAPI();
  const removeQueryParamImage = useCallback(() => {
    setQueryParamImagePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [history, pathname, search]);

  const sendImageMessage = useCallback(
    (m) => {
      sendMessage({ conversationId: messageGroupId, message: m });
      onClose();
    },
    [sendMessage, messageGroupId, onClose],
  );

  const sendFromQueryParam = useCallback(
    (image) => {
      sendImageMessage(image);
      removeQueryParamImage();
    },
    [removeQueryParamImage, sendImageMessage],
  );

  useEffect(() => {
    if (!image) return;
    setQueryParamImagePreview(image);
  }, [image]);

  const menuOptions = useMemo(
    () => [
      {
        label: t('MESSAGES.POSITION_OPTION'),
        onClick: () => {
          fetchNui<ServerPromiseResp<any>>(MessageEvents.GET_POSITION, {}).then((resp) => {
            sendMessage({ conversationId: messageGroupId, message: `vec2(${resp.data.x},${resp.data.y})` })
          })
        }
      },
      {
        label: t('MESSAGES.DESTINATION_OPTION'),
        onClick: () => {
          fetchNui<ServerPromiseResp<any>>(MessageEvents.GET_DESTINATION, {}).then((resp) => {
            if (resp.data.x !== 0 && resp.data.y !== 0) {
              sendMessage({ conversationId: messageGroupId, message: `vec2(${resp.data.x},${resp.data.y})` })
            } else {
              addAlert({
                message: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
                type: 'error',
              });
            }
          })
        }
      },
      {
        label: t('MESSAGES.MEDIA_OPTION'),
        onClick: () =>
          history.push(
            `/camera?${qs.stringify({
              referal: encodeURIComponent(pathname + search),
            })}`,
          ),
      },
    ],
    [addAlert, messageGroupId, sendMessage, history, pathname, search, t],
  );

  return (
    <>
      <ContextMenu open={isOpen} options={menuOptions} onClose={onClose} />
      <Modal visible={queryParamImagePreview} handleClose={removeQueryParamImage}>
        <Box py={1}>
          <Typography paragraph>Do you want to share this image?</Typography>
          <PictureResponsive src={queryParamImagePreview} alt="Share gallery image preview" />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => sendFromQueryParam(queryParamImagePreview)}
          >
            Share
          </Button>
        </Box>
      </Modal>
    </>
  );
};
