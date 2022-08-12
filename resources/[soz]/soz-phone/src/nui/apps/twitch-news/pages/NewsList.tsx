import dayjs from 'dayjs';
import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { Card } from '../components/Card';

require('dayjs/locale/fr');
dayjs.locale('fr');

const NewsList = (): any => {
    const newsList = useSelector((state: RootState) => state.appTwitchNews);

    return (
        <ul className={`p-2`}>
            {newsList.map(news => (
                <Card key={news.id} {...news} />
            ))}
        </ul>
    );
};

export default NewsList;
