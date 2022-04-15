import React, {useCallback, useEffect, useState} from "react";
import cn from "classnames";
import styles from "./styles.module.css";

const Input= () => {
    const [title, setTitle] = useState<string|null>(null);
    const [maxChar, setMaxChar] = useState<number>(32);
    const [value, setValue] = useState<string>('');

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'draw_input') {
            if (event.data.title) setTitle(event.data.title)
            if (event.data.maxChar) setMaxChar(event.data.maxChar)
            if (event.data.content) setValue(event.data.content)
        }
    }, [setTitle, setMaxChar, setValue])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setValue(event.target.value)
    }

    const handleSubmit = (event: React.KeyboardEvent<HTMLTextAreaElement>|React.FormEvent<HTMLFormElement>) => {
        if ("preventDefault" in event) {
            event.preventDefault();
        }

        fetch(`https://soz-hud/input/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({data: value}),
        }).then(() => {
            setTitle(null)
            setMaxChar(32)
            setValue('')
        });
    }

    const onEnterPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === 'Enter' && event.shiftKey == false) {
            event.preventDefault()
            handleSubmit(event)
        }
    }

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            fetch(`https://soz-hud/input/close`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({})
            }).then(() => {
                setTitle(null)
                setMaxChar(32)
                setValue('')
            });
        }
    }

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)
        window.addEventListener('keyup', onKeyUpReceived)

        return () => {
            window.removeEventListener('message', onMessageReceived)
            window.removeEventListener('keyup', onKeyUpReceived)
        }
    }, [onMessageReceived, onKeyUpReceived]);

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={cn(styles.formContainer, {
                [styles.show]: title !== null,
                [styles.hide]: title === null,
            })}>
                {title !== null && <>
                    <h2>{title}</h2>

                    {maxChar <= 64 ? (
                        <input type="text" value={value} autoFocus={true} onChange={handleChange} maxLength={maxChar}/>
                    ) : (
                        <textarea value={value} autoFocus={true} onChange={handleChange} onKeyDown={onEnterPress} maxLength={maxChar} rows={5}/>
                    )}
                </>}
            </form>
        </div>
    )
}

export default Input;
