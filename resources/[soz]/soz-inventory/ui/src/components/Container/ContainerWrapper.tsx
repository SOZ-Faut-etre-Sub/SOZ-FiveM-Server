import { FunctionComponent, PropsWithChildren } from 'react';
import {clsx} from 'clsx'
import style from './ContainerWrapper.module.css';

type Props = {
    display: boolean;
    banner: string
    weight?: number;
    maxWeight?: number;
    sortCallback?: () => void;
}

export const ContainerWrapper: FunctionComponent<PropsWithChildren<Props>> = ({display, banner, weight = 1000, maxWeight = 1000, sortCallback, children}) => {
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
                    <>
                    {sortCallback ? (
                        <span className={style.Sort} onClick={sortCallback}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                            </svg>
                            A-Z
                        </span>
                    ): <span />}
                        <span>
                            {weight / 1000}/{maxWeight / 1000} Kg
                        </span>
                    </>
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
