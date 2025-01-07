import React from 'react';

import { useAssetPath } from '../../../../hook/assets';

const ZutomIcon: React.FC = props => {
    const { getPath } = useAssetPath();

    return <img {...props} alt="Zutom" src={getPath(`images/phone/apps/zutom/logo.webp`)} />;
};

export default ZutomIcon;
