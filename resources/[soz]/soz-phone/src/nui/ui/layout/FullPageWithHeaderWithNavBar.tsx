import { FunctionComponent, memo, PropsWithChildren } from 'react';

import { NavigationBar } from '../components/NavigationBar';
import { TopHeaderBar } from '../components/TopHeaderBar';
import { FullPageWithoutHeader } from './FullPageWithoutHeader';

export const FullPageWithHeaderWithNavBar: FunctionComponent<PropsWithChildren<any>> = memo(
    ({ children, className }) => {
        return (
            <FullPageWithoutHeader className={className}>
                <TopHeaderBar />
                <div className="grid grid-rows-2">{children}</div>
                <NavigationBar />
            </FullPageWithoutHeader>
        );
    }
);
