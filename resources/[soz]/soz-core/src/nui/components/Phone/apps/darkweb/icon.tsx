import React from 'react';

import { useAssetPath } from '../../../../hook/assets';

const DarkWebIcon: React.FC = props => {
    const { getPath } = useAssetPath();

    return <img src={getPath('images/phone/apps/darkweb.webp')} {...props} />;
};

export default DarkWebIcon;
