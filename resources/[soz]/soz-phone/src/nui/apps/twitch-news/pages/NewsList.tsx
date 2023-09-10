import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { Card } from '../components/Card';
import { useTwitchNewsNotifications } from '../hooks/useTwitchNewsNotifications';

const NewsList = (): any => {
    const newsList = useSelector((state: RootState) => state.appTwitchNews);
    const { removeNotification } = useTwitchNewsNotifications();

    useEffect(() => {
        removeNotification();
    }, []);

    return (
        <ul className={`p-2`}>
            {newsList.map(news => (
                <Card key={news.id} {...news} />
            ))}
        </ul>
    );
};

export default NewsList;
