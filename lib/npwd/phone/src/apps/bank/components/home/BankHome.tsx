import React, {useContext} from 'react';
import {useCredentials} from '../../hooks/useCredentials';
import {BankCard} from "../account/BankCard";
import {AppContent} from "@ui/components/AppContent";
import {ThemeContext} from "../../../../styles/themeProvider";

export const BankHome = () => {
    const credentials = useCredentials();
    const {theme} = useContext(ThemeContext);

    return (
        <AppContent className="mt-14 mb-4">
            {credentials ? (
                <div>
                    <BankCard name={credentials.name} account="Checking" balance={credentials.balance}/>
                </div>
            ) : (
                <div className={`h-[600px] w-full flex justify-center items-center ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    Information non disponible
                </div>
            )}
        </AppContent>
    );
};
