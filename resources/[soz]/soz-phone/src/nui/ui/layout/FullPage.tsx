import { FunctionComponent, memo, PropsWithChildren } from 'react';

import { NavigationBar } from '../components/NavigationBar';
import { TopHeaderBar } from '../components/TopHeaderBar';
import { FullPageWithoutHeader } from './FullPageWithoutHeader';

export const FullPage: FunctionComponent<
    PropsWithChildren<{ className?: string; withHeader?: boolean; withNavBar?: boolean }>
> = memo(({ children, className, withHeader = true, withNavBar = true }) => {
    return (
        <FullPageWithoutHeader className={className}>
            {withHeader && <TopHeaderBar />}
            <div className="grid grid-rows-2">{children}</div>
            {withNavBar && <NavigationBar />}
        </FullPageWithoutHeader>
    );
});
