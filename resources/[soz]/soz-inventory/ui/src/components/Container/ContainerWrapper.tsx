import { FunctionComponent, PropsWithChildren } from 'react';
import {clsx} from 'clsx'
import style from './ContainerWrapper.module.css';

type Props = {
    display: boolean;
    banner: string
    weight?: number;
    maxWeight?: number;
}

export const ContainerWrapper: FunctionComponent<PropsWithChildren<Props>> = ({display, banner, weight = 1000, maxWeight = 1000, children}) => {
    return (
        <main
            className={clsx(style.Wrapper, {
                [style.Show]: display,
                [style.Hide]: !display,
            })}
        >
            <header className={style.Banner} style={{
                background: `url("${banner}") left center / cover no-repeat, url("/html/banner/default.jpg") left center / cover no-repeat`,
                backgroundSize: 'cover',
            }}>
                {maxWeight !== -1 && (
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
