import { FunctionComponent, PropsWithChildren } from 'react';
import {clsx} from 'clsx'
import style from './ContainerWrapper.module.css';

type Props = {
    display: boolean;
    banner: string
    weight?: number;
    maxWeight?: number;
}

export const ContainerWrapper: FunctionComponent<PropsWithChildren<Props>> = ({display, banner, weight, maxWeight, children}) => {
    return (
        <main
            className={clsx(style.Wrapper, {
                [style.Show]: display,
                [style.Hide]: !display,
            })}
        >
            <header className={style.Banner} style={{
                background: `url("${banner}") left no-repeat`,
                backgroundSize: 'cover'
            }}>
                {weight && maxWeight && (
                    <span>
                        {weight / 1000}/{maxWeight / 1000} Kg
                    </span>
                )}
            </header>

            {children}
        </main>
    )
}

ContainerWrapper.defaultProps = {
    display: false,
    banner: '',
    weight: 0,
    maxWeight: 0,
}
