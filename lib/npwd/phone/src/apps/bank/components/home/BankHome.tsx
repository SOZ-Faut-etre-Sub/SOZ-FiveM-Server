import React, {useContext} from 'react';
import {useCredentials} from '../../hooks/useCredentials';
import {BankCard} from "../account/BankCard";
import {AppContent} from "@ui/components/AppContent";
import {ThemeContext} from "../../../../styles/themeProvider";
import cn from 'classnames';

const EyeIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
}

const LockIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
    </svg>
}

const CogIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
}

const CartEntry = ({title, enabled}) => {
    const {theme} = useContext(ThemeContext);

    return <div className="flex justify-between items-center py-2">
                            <span className={cn("text-sm font-medium ", {
                                'text-gray-100': theme === 'dark',
                                'text-gray-900': theme === 'light'
                            })}>{title}</span>
        <button
            className={cn("relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200", {
                'bg-indigo-600': enabled,
                'bg-gray-300': !enabled
            })}>
            <span
                className={cn("pointer-events-none inline-block self-center h-4 w-4 rounded-full bg-white shadow transform transition ease-in-out duration-200", {
                    'translate-x-5': enabled,
                    'translate-x-0': !enabled
                })}/>
        </button>
    </div>
}

export const BankHome = () => {
    const credentials = useCredentials();
    const {theme} = useContext(ThemeContext);

    return (
        <AppContent className="mt-14 mb-4">
            {credentials ? (
                <div>
                    <div className="m-auto pt-1 pb-3 flex flex-col w-5/6">
                        <h2 className={cn("text-3xl", {
                            "text-red-500": credentials.balance <= 0,
                            "text-emerald-500": credentials.balance > 0,
                        })}>
                            {credentials.balance.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
                        </h2>
                        <h5 className="text-xs uppercase font-light">Solde actuel</h5>
                    </div>
                    <BankCard name={credentials.name} account={credentials.account}/>
                    <div className="flex pt-10 p-6 justify-around">
                        <div className={cn("p-3 rounded-full text-white bg-opacity-50", {
                            'bg-white border-white': theme === 'dark',
                            'bg-black border-black': theme === 'light',
                        })}>
                            <EyeIcon/>
                        </div>
                        <div className={cn("p-3 rounded-full text-dark/50 border border-opacity-50", {
                            'text-white border-white': theme === 'dark',
                            'text-black border-black': theme === 'light',
                        })}>
                            <LockIcon/>
                        </div>
                        <div className={cn("p-3 rounded-full text-dark/50 border border-opacity-50", {
                            'text-white border-white': theme === 'dark',
                            'text-black border-black': theme === 'light',
                        })}>
                            <CogIcon/>
                        </div>
                    </div>
                    <div className="p-6">
                        <h2 className={cn("text-2xl", {
                            'text-white': theme === 'dark',
                            'text-black': theme === 'light',
                        })}>Paramètre de la carte</h2>

                        <CartEntry title="Activer les retaits distributeurs" enabled={true} />
                        <CartEntry title="Paiement en ligne" enabled={false} />
                        <CartEntry title="Stonks Gold+" enabled={false} />
                    </div>
                </div>
            ) : (
                <div className={`h-[600px] w-full flex justify-center items-center ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    Information non disponible
                </div>
            )}
        </AppContent>
    );
};
