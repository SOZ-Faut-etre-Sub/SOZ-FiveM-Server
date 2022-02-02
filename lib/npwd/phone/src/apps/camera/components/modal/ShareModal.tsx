import React from 'react';
import Modal from '../../../../ui/components/Modal';
import { setClipboard } from '@os/phone/hooks/useClipboard';

import { useHistory } from 'react-router-dom';
import { GalleryPhoto } from '@typings/photo';
import { useTranslation } from 'react-i18next';

interface IShareModalProps {
  meta: GalleryPhoto;
  referal: string;
  onClose(): void;
}

export const ShareModal = ({ meta, onClose, referal }: IShareModalProps) => {
  const history = useHistory();
  const [t] = useTranslation();

  const handleCopyImage = () => {
    setClipboard(meta.image);
    history.push(referal);
  };

  return (
    <Modal visible={!!meta} handleClose={onClose}>
      <div >
        <div >
          <h4>{t('CAMERA.COPY_IMAGE')}</h4>
          <button onClick={handleCopyImage}>
            Copy image
          </button>
        </div>
      </div>
    </Modal>
  );
};
