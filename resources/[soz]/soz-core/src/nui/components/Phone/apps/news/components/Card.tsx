import clsx from 'clsx';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { FunctionComponent, memo } from 'react';

import { JobType } from '../../../../../../shared/job';
import { NewsMessage } from '../../../../../../shared/phone/apps/news';
import { useThemeConfig } from '../../../system/config/config.atom';
import { convertTypeToName, isBCSOMessage, isLSPDMessage, isPoliceMessage, isSASPMessage } from '../utils/isPolice';
import { PoliceContent } from './PoliceContent';

export const Card: FunctionComponent<NewsMessage> = memo(({ type, image, message, reporter, createdAt, job }) => {
    const theme = useThemeConfig();

    return (
        <li
            className={clsx('w-full my-3 rounded shadow border-l-4', {
                'bg-ios-700': theme === 'dark',
                'bg-white': theme === 'light',
                'border-[#3336E1]': isLSPDMessage(type),
                'border-[#2d5547]': isBCSOMessage(type),
                'border-[#c1b7af]': isSASPMessage(type),
                'border-[#6741b1]': isPoliceMessage(type) === false && job === JobType.News,
                'border-[#B11F1E]': isPoliceMessage(type) === false && job === JobType.YouNews,
                'border-[#0c60ac]': isPoliceMessage(type) === false && job === JobType.Gouv,
                'border-[#023c5c]': isPoliceMessage(type) === false && job === JobType.FBI && type !== 'presidence',
                'border-[#041131]': isPoliceMessage(type) === false && job === JobType.FBI && type === 'presidence',
            })}
        >
            <div className={`relative p-3 flex items-center space-x-3`}>
                <div className="flex-1 min-w-0">
                    <h2
                        className={clsx('text-center', {
                            'text-gray-100': theme === 'dark',
                            'text-gray-700': theme === 'light',
                        })}
                    >
                        {convertTypeToName(type)}
                    </h2>
                    {image && (
                        <div
                            className="bg-center bg-cover h-48 w-full rounded-lg shadow my-2"
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    )}
                    <p
                        className={clsx('text-left text-sm font-medium', {
                            'text-gray-100': theme === 'dark',
                            'text-gray-700': theme === 'light',
                        })}
                    >
                        {isPoliceMessage(type) ? (
                            <PoliceContent type={type} message={message} job={job} />
                        ) : (
                            <>{message}</>
                        )}
                    </p>
                    <p className="flex justify-between text-xs text-gray-400">
                        <span>{reporter}</span>
                        <span>
                            {formatDistance(createdAt, new Date(), {
                                locale: fr,
                            })}
                        </span>
                    </p>
                </div>
            </div>
        </li>
    );
});
