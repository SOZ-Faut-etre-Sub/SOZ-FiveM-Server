import React, { FunctionComponent, memo } from 'react';

import { AppIcon } from '../../components/system/AppIcon';

const BankIcon: FunctionComponent = memo(props => {
    return <AppIcon {...props} name="bank" />;
});

export default BankIcon;
