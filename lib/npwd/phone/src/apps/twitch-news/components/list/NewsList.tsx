import React, {useContext} from 'react';
import {useMessagesValue} from "../../hooks/state";
import dayjs from "dayjs";
import cn from "classnames";
import {ThemeContext} from "../../../../styles/themeProvider";
require('dayjs/locale/fr')
dayjs.locale('fr')

const NewsList = (): any => {
    const societyMessages = useMessagesValue();
    const {theme} = useContext(ThemeContext);

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
                <li className={cn('w-full my-3 rounded shadow border-l-4', {
                    'bg-[#1C1C1E]': theme === 'dark',
                    'bg-white': theme === 'light',
                    'border-[#3336E1]': /lspd(:end)?/.test(message.type),
                    'border-[#2d5547]': /bcso(:end)?/.test(message.type),
                    'border-[#6741b1]': /(lspd|bcso)(:end)?/.test(message.type) === false,
                })}>
                    <div className={`relative p-3 flex items-center space-x-3`}>
                        <div className="flex-1 min-w-0">
                            <h2 className={`text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>{prefixMessage(message.type)}</h2>
                            {message.image && <div className="bg-center bg-cover h-48 w-full rounded-lg shadow my-2" style={{backgroundImage: `url(${message.image})`}}/>}
                            <p className={`text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>
                                {/(lspd|bcso)(:end)?/.test(message.type) ? (
                                    <>
                                        {/^(lspd|bcso)$/.test(message.type) ? (
                                            <>
                                                Les forces de l'ordre sont à la recherche de <strong>{message.message}</strong>.
                                                <br/>
                                                Si vous avez des informations sur cette personne,
                                                veuillez les communiquer au <strong style={{textTransform: 'uppercase'}}>555-{message.type}</strong>.
                                            </>
                                        ) : (
                                            <>
                                                Les forces de l'ordre ont arrêté <strong>{message.message}</strong>.
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {message.message}
                                    </>
                                )}

                            </p>
                            <p className="flex justify-between text-xs text-gray-400">
                                <span>{message.reporter}</span>
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
