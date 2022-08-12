import cn from 'classnames';
import { FunctionComponent, memo, PropsWithChildren } from 'react';

export const FullPageWithoutHeader: FunctionComponent<PropsWithChildren<any>> = memo(({ children, className }) => {
    return <div className={cn('h-full w-full', className)}>{children}</div>;
});
