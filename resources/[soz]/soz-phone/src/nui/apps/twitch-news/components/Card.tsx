import cn from 'classnames';
import dayjs from 'dayjs';
import React, { FunctionComponent, memo } from 'react';

import { TwitchNewsMessage } from '../../../../../typings/twitch-news';
import { useConfig } from '../../../hooks/usePhone';
import {
    convertTypeToName,
    isActivePoliceMessage,
    isBCSOMessage,
    isLSPDMessage,
    isPoliceMessage,
} from '../utils/isPolice';
import { PoliceContent } from './PoliceContent';

export const Card: FunctionComponent<TwitchNewsMessage> = memo(
    ({ type, image, message, reporter, createdAt }: TwitchNewsMessage) => {
        const config = useConfig();

        return (
            <li
                className={cn('w-full my-3 rounded shadow border-l-4', {
                    'bg-[#1C1C1E]': config.theme.value === 'dark',
                    'bg-white': config.theme.value === 'light',
                    'border-[#3336E1]': isLSPDMessage(type),
                    'border-[#2d5547]': isBCSOMessage(type),
                    'border-[#6741b1]': isPoliceMessage(type) === false,
                })}
            >
                <div className={`relative p-3 flex items-center space-x-3`}>
                    <div className="flex-1 min-w-0">
                        <h2
                            className={cn('text-center', {
                                'text-gray-100': config.theme.value === 'dark',
                                'text-gray-700': config.theme.value === 'light',
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
                            className={cn('text-left text-sm font-medium', {
                                'text-gray-100': config.theme.value === 'dark',
                                'text-gray-700': config.theme.value === 'light',
                            })}
                        >
                            {isPoliceMessage(type) ? <PoliceContent type={type} message={message} /> : <>{message}</>}
                        </p>
                        <p className="flex justify-between text-xs text-gray-400">
                            <span>{reporter}</span>
                            <span>{dayjs().to(createdAt)}</span>
                        </p>
                    </div>
                </div>
            </li>
        );
    }
);
