import cn from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

export const FullPageWithoutHeader: FunctionComponent<PropsWithChildren<any>> = ({ children, className }) => {
    return <div className={cn('h-full w-full', className)}>{children}</div>;
};
