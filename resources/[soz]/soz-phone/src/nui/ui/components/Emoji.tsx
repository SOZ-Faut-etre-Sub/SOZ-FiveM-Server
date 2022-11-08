import data from '@emoji-mart/data/sets/14/apple.json';
import { init } from 'emoji-mart';
import React from 'react';

init({ data });

function Emoji({ emoji, size = '24px' }) {
    return (
        <span className="inline-flex px-0.5">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <em-emoji set="apple" shortcodes={emoji} size={size} fallback={() => emoji} />
        </span>
    );
}

export default Emoji;
