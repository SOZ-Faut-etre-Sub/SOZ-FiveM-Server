import { PaperAirplaneIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { IconComponentProps } from '../system/phone.types';

export const FlyIcon: FunctionComponent<IconComponentProps> = ({ className }) => {
    return <PaperAirplaneIcon className={clsx(`text-white bg-orange-500 px-0.5 rounded-sm`, className)} />;
};
