import { FunctionComponent, memo, PropsWithChildren } from 'react';

import { NavigationBar } from '../components/NavigationBar';
import { TopHeaderBar } from '../components/TopHeaderBar';
import { FullPageWithoutHeader } from './FullPageWithoutHeader';

export const FullPageWithHeader: FunctionComponent<PropsWithChildren<any>> = memo(({ children, className }) => {
    return (
        <FullPageWithoutHeader className={className}>
            <TopHeaderBar />
            {children}
            <NavigationBar />
        </FullPageWithoutHeader>
    );
});
