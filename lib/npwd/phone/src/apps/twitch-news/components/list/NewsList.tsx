import React, {useContext} from 'react';
import {useMessagesValue} from "../../hooks/state";
import dayjs from "dayjs";
import {ThemeContext} from "../../../../styles/themeProvider";
require('dayjs/locale/fr')
dayjs.locale('fr')

const NewsList = (): any => {
    const societyMessages = useMessagesValue();
    const {theme} = useContext(ThemeContext);

    const newsColor = function (type) {
        switch (type) {
            case 'annonce':
                return 'border-violet-500'
            case 'breaking-news':
                return 'border-red-500'
            case 'publicité':
                return 'border-pink-500'
            case 'fait-divers':
                return 'border-orange-500'
            case 'info-traffic':
                return 'border-blue-500'
        }
    }

    const prefixMessage = function (type) {
        switch (type) {
            case 'annonce':
                return 'Annonce'
            case 'breaking-news':
                return 'Breaking News'
            case 'publicité':
                return 'Publicité'
            case 'fait-divers':
                return 'Fait Divers'
            case 'info-traffic':
                return 'Info Traffic'
        }
    }

    return (
        <ul className={`mt-5 p-2`}>
            {societyMessages.map((message) => (
                <li className={`w-full my-3 rounded shadow border-l-4 ${newsColor(message.type)} ${theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-white'}`}>
                    <div className={`relative p-3 flex items-center space-x-3`}>
                        <div className="flex-1 min-w-0">
                            <h2 className={`text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>{prefixMessage(message.type)}</h2>
                            {message.image && <div className="bg-center bg-cover h-48 w-full rounded-lg shadow my-2" style={{backgroundImage: `url(${message.image})`}}/>}
                            <p className={`text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>
                                {message.message}
                            </p>
                            <p className="flex justify-end text-xs text-gray-400">
                                <span>{dayjs().to(message.createdAt)}</span>
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default NewsList;
