import React from 'react';

interface IStyleProps {
  size: string;
}

interface PictureThumbnailProps {
  src: string;
  alt: string;
  size?: string;
}


export const PictureThumbnail: React.FC<PictureThumbnailProps> = ({ src, alt, size = '3em' }) => (
  <img src={src} alt={alt} />
);
