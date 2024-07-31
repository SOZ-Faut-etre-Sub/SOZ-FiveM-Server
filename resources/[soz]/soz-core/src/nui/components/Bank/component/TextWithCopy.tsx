import { ClipboardCheckIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';

interface TextWithCopyProps {
    text: string;
}

export const TextWithCopy: FunctionComponent<PropsWithChildren<TextWithCopyProps>> = ({ text, children }) => {
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
        <div className="flex items-center gap-1">
            <div>{children}</div>
            {isCopied ? (
                <ClipboardCheckIcon className="h-4 w-4 text-green-500" />
            ) : (
                <ClipboardCopyIcon onClick={copyToClipboard} className="cursor-pointer h-4 w-4" />
            )}
        </div>
    );
};
