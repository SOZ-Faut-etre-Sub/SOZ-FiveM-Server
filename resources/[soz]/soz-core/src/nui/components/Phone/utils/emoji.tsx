import React, { Fragment } from 'react';

import { Emoji } from '../components/Emoji';

export const replaceEmoji = (string: string) => {
    return string?.split(/(:[a-zA-Z0-9-_+]+::[a-zA-Z0-9-_+]+:)|(:[a-zA-Z0-9-_+]+:)/g).map((text, i) => {
        if (text?.startsWith(':') && text?.endsWith(':')) {
            return <Emoji key={i} emoji={text} />;
        }

        return <Fragment key={i}>{text}</Fragment>;
    });
};
