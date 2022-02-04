import React from 'react';
import {useCredentials} from '../../hooks/useCredentials';
import {BankCard} from "../account/BankCard";
import {AppContent} from "@ui/components/AppContent";

export const BankHome = () => {
    const credentials = useCredentials();

    return (
        <AppContent className="mt-14 mb-4">
            {credentials ? (
                <div>
                    <BankCard name={credentials.name} account="Checking" balance={credentials.balance}/>
                </div>
            ) : (
                <div className="h-[600px] w-full flex justify-center items-center text-white">
                    Could not load credentials
                </div>
            )}
        </AppContent>
    );
};
