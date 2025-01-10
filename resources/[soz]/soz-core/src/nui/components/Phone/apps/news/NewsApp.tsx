import React, { FunctionComponent } from 'react';

import { AppContainer } from '../../components/system/AppContainer';
import { AppContent } from '../../components/system/AppContent';
import { AppTitle } from '../../components/system/AppTitle';
import { AppWrapper } from '../../components/system/AppWrapper';
import { useApp } from '../../system/apps/hooks/useApp';
import { Card } from './components/Card';
import { useNews } from './news.atom';

export const NewsApp: FunctionComponent = () => {
    const newsApp = useApp('news');

    const news = useNews();

    return (
        <AppContainer>
            <AppWrapper scrollable>
                <AppTitle app={newsApp} />
                <AppContent>
                    <ul className={`p-2`}>
                        {news.map(n => (
                            <Card key={n.id} {...n} />
                        ))}
                    </ul>
                </AppContent>
            </AppWrapper>
        </AppContainer>
    );
};
