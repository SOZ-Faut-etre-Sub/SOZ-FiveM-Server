import classNames from 'classnames';
import {
    ChangeEvent,
    FormEvent,
    FunctionComponent,
    KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';
import colors from 'tailwindcss/colors';

import { NuiEvent } from '../../../shared/event';
import { AskInput } from '../../../shared/nui/input';
import { isErr, Result } from '../../../shared/result';
import { fetchNui } from '../../fetch';
import { useInputNuiEvent, useNuiFocus } from '../../hook/nui';
import { Dispatch } from '../../store';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

export const InputApp: FunctionComponent = () => {
    const [askInput, setAskInput] = useState<AskInput | null>(null);
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<Dispatch>();

    const setInputAppRef = useCallback((element: HTMLDivElement | null) => {
        if (element) {
            dispatch.outside.add('input', element);
        } else {
            dispatch.outside.remove('input');
        }
    }, []);

    useNuiFocus(askInput !== null, askInput !== null, false);

    useInputNuiEvent('AskInput', askInput => {
        setAskInput(askInput);
        setValue(askInput.defaultValue || '');
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
        'resize-none box-border w-full text-white bg-white/5 outline-none py-1 px-2 border rounded-md',
        {
            'border-rose-500': error !== null,
            'border-green-800': error === null,
        }
    );

    return (
        <div ref={setInputAppRef} className="absolute inset-0 flex items-center justify-center z-50">
            <div>
                <GlassMorphismContainer
                    className="absolute h-full w-[100vh]"
                    borderColor={colors.gray[700]}
                    borderClassName="rounded-lg"
                >
                    <form onSubmit={handleSubmit} className="w-[100vh] p-2">
                        <h2 className="text-base text-white drop-shadow-md mb-2 ml-2">{askInput.title}</h2>

                        {askInput.maxCharacters <= 64 ? (
                            <input
                                className={inputClassnames}
                                type="text"
                                autoFocus
                                value={value}
                                onChange={handleChange}
                                maxLength={askInput.maxCharacters}
                            />
                        ) : (
                            <textarea
                                className={inputClassnames}
                                autoFocus
                                value={value}
                                onChange={handleChange}
                                onKeyDown={onEnterPress}
                                maxLength={askInput.maxCharacters}
                                rows={5}
                            />
                        )}
                        {error !== null && <p className="text-rose-500 text-sm mt-1 drop-shadow-md">{error}</p>}
                    </form>
                </GlassMorphismContainer>
            </div>
        </div>
    );
};
