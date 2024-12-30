import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';

const SettingsIcon: FunctionComponent<any> = props => {
    const theme = useSelector((state: RootState) => state.phone.config.theme.value);
    return <img {...props} src={`media/apps/settings/logo-${theme}.webp`} />;
};

export default SettingsIcon;
