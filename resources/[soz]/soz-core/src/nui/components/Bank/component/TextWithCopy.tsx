import { ClipboardCheckIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import classnames from 'classnames';
import cn from 'classnames';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';

import FileIcon from '../assets/file.svg';

interface TextWithCopyProps {
    text: string;
    className?: string;
    buttonClassName?: string;
}

export const TextWithCopy: FunctionComponent<PropsWithChildren<TextWithCopyProps>> = ({
    text,
    className,
    buttonClassName,
    children,
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        const clipElem = document.createElement('input');
        clipElem.value = text;
        document.body.appendChild(clipElem);
        clipElem.select();
        document.execCommand('copy');
        document.body.removeChild(clipElem);

        setIsCopied(true);
    };

    useEffect(() => {
        if (isCopied) {
            const timeout = setTimeout(() => {
                setIsCopied(false);
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [isCopied]);

    return (
        <div className="flex items-center gap-2.5">
            <div className={className}>{children}</div>
            <FileIcon
                onClick={copyToClipboard}
                className={cn('size-5', buttonClassName, {
                    'text-green-500': isCopied,
                    'cursor-pointer': !isCopied,
                })}
            />
        </div>
    );
};
