import classNames from 'classnames';
import { ChangeEvent, FormEvent, FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { AskInput } from '../../../shared/nui/input';
import { isErr, Result } from '../../../shared/result';
import { fetchNui } from '../../fetch';
import { useInputNuiEvent, useNuiFocus } from '../../hook/nui';

export const InputApp: FunctionComponent = () => {
    const [askInput, setAskInput] = useState<AskInput | null>(null);
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useNuiFocus(askInput !== null, askInput !== null, askInput === null);

    useInputNuiEvent('AskInput', askInput => {
        setAskInput(askInput);
        setValue(askInput.defaultValue);
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(event.target.value);
        setError(null);
    };

    const handleSubmit = async (event: KeyboardEvent<HTMLTextAreaElement> | FormEvent<HTMLFormElement>) => {
        if ('preventDefault' in event) {
            event.preventDefault();
        }

        const result = await fetchNui<string, Result<any, string>>(NuiEvent.InputSet, value);

        if (isErr(result)) {
            setError(result.err);
        } else {
            setAskInput(null);
            setValue('');
            setError(null);
        }
    };

    const onEnterPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && event.shiftKey == false) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            fetchNui<any, any>(NuiEvent.InputCancel, null);

            setAskInput(null);
            setValue('');
            setError(null);
        }
    };

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    if (!askInput) {
        return null;
    }

    const inputClassnames = classNames(
        'resize-none box-border w-full text-white bg-black bg-opacity-15 outline-none p-1 border',
        {
            'border-rose-500': error !== null,
            'border-lime-700': error === null,
        }
    );

    return (
        <div className="absolute h-full w-full flex items-center justify-center bg-black bg-opacity-25">
            <form onSubmit={handleSubmit} className="w-3/5 p-2 bg-black bg-opacity-75">
                <h2 className="text-base text-white drop-shadow-md mb-2 capitalize">{askInput.title}</h2>

                {askInput.maxCharacters <= 64 ? (
                    <input
                        className={inputClassnames}
                        type="text"
                        autoFocus={true}
                        value={value}
                        onChange={handleChange}
                        maxLength={askInput.maxCharacters}
                    />
                ) : (
                    <textarea
                        className={inputClassnames}
                        autoFocus={true}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={onEnterPress}
                        maxLength={askInput.maxCharacters}
                        rows={5}
                    />
                )}
                {error !== null && <p className="text-rose-500 text-sm mt-1 drop-shadow-md">{error}</p>}
            </form>
        </div>
    );
};
