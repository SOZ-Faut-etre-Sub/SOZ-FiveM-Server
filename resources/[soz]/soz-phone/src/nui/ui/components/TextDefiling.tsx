import cn from 'classnames';
import React, { FunctionComponent } from 'react';

type Props = {
    text?: string;
    maxLength?: number;
};

export const TextDefiling: FunctionComponent<Props> = ({ text, maxLength }) => {
    const textLength = text.length;

    return (
        <div>
            {textLength > maxLength && (
                <>
                    <div className={cn('overflow-hidden flex invisible')}>
                        <span
                            className={cn(
                                'inline-block whitespace-nowrap scroll-pl-[100%] scroll-pr-[2em] group-hover:animate-defilement visible'
                            )}
                        >
                            {text}&nbsp;&nbsp;&nbsp;
                        </span>
                        <span
                            className={cn(
                                'inline-block whitespace-nowrap scroll-pl-[100%] scroll-pr-[2em] group-hover:animate-defilement group-hover:visible'
                            )}
                        >
                            {text}&nbsp;&nbsp;&nbsp;
                        </span>
                    </div>
                </>
            )}
            {textLength <= maxLength && <>{text}</>}
        </div>
    );
};
