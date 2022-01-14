import React, { useState } from 'react';
import { Button } from '@mui/material';
import { PictureThumbnail } from './PictureThumbnail';
import { PictureResponsive } from './PictureResponsive';
import Modal from './Modal';

interface PictureProps {
  src: string;
  alt: string;
  size?: string;
}

export const Picture: React.FC<PictureProps> = ({ src, alt, size }) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>
        <PictureThumbnail size={size} src={src} alt={alt} />
      </Button>
      <Modal visible={visible} handleClose={() => setVisible(false)}>
        <PictureResponsive src={src} alt={alt} />
      </Modal>
    </>
  );
};
