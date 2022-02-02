import React from 'react';

interface PictureResponsiveProps {
  src: string;
  alt: string;
}


export const PictureResponsive: React.FC<PictureResponsiveProps> = ({ src, alt }) => (
  <img src={src} alt={alt} />
);
