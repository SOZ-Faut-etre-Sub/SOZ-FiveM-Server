import { PaperAirplaneIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';

type FlyIconProps = PropsWithChildren<ComponentProps<'svg'>>;

export const FlyIcon: FunctionComponent<FlyIconProps> = ({ className }) => {
    return <PaperAirplaneIcon className={clsx(`text-white bg-orange-500 px-0.5 rounded-sm`, className)} />;
};
