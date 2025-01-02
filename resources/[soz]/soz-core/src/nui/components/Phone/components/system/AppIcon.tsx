import React, { FunctionComponent } from 'react';

import { useAssetPath } from '../../../../hook/assets';
import { useThemeConfig } from '../../system/config/config.atom';

interface AppIconProps {
    name: string;
}

export const AppIcon: FunctionComponent<AppIconProps> = ({ name, ...props }) => {
    const { getPath } = useAssetPath();
    const theme = useThemeConfig();

    return <img {...props} alt={name} src={getPath(`images/phone/apps/${name}/logo-${theme}.webp`)} />;
};
