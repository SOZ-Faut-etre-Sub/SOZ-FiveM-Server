import React from 'react';

interface PictureThumbnailProps {
    src: string;
    alt: string;
}

export const PictureThumbnail: React.FC<PictureThumbnailProps> = ({ src, alt }) => <img src={src} alt={alt} />;
