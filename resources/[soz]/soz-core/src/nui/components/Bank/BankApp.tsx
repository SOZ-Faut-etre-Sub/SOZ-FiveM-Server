import { Transition } from '@headlessui/react';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { FaArrowRightArrowLeft, FaArrowRightFromBracket, FaHouse } from 'react-icons/fa6';
import { GiPalmTree } from 'react-icons/gi';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';

import { BankUiData } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { AppContent } from './component/AppContent';
import { ApplicationContainer } from './component/Application';
import { MenuGroup } from './component/MenuGroup';
import { MenuLink } from './component/MenuLink';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { OffshorePage } from './pages/OffshorePage';

export const BankApp: FunctionComponent = () => {
    const [showApp, setShowApp] = useState<boolean>(false);
    const [keepFocus, setKeepFocus] = useState<boolean>(false);

    const [data, setData] = useState<BankUiData>({} as BankUiData);

    const resetApp = async () => {
        setShowApp(false);

        if (!showApp) return;
        await fetchNui(NuiEvent.BankAnimation, { type: 'exit' });
        setKeepFocus(false);
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        resetApp();
    };

    useNuiFocus(keepFocus, keepFocus, false);

    useNuiEvent('bank', 'ShowAccount', (data: boolean) => {
        setShowApp(data);
        setKeepFocus(data);
    });

    useNuiEvent('bank', 'UpdateAccountData', (data: BankUiData) => {
        setData(data);
    });

    useNuiEvent('bank', 'CloseInterface', resetApp);

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    if (!showApp) {
        return null;
    }

    return (
        <ApplicationContainer size="full" onClickOutside={resetApp}>
            <Transition
                as={AppContent}
                show={showApp}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-full opacity-0"
                enterTo="translate-y-0 opacity-1"
                leave="transform ease-in duration-300 transition"
                leaveFrom="translate-y-0 opacity-1"
                leaveTo="translate-y-full opacity-0"
            >
                <MemoryRouter>
                    <div className="flex flex-col w-1/6">
                        <img
                            className="flex-none py-10 self-center"
                            src="https://soz.zerator.com/static/game/images/bank/logo.webp"
                            alt="Fleeca Logo"
                        />
                        <div className="flex flex-col grow gap-8">
                            <MenuGroup title="Compte personnel">
                                <MenuLink
                                    to="/personal"
                                    title="Tableau de bord"
                                    icon={<FaHouse className="h-4 w-4" />}
                                />
                                <MenuLink
                                    to="/personal/history"
                                    title="Historique"
                                    icon={<FaArrowRightArrowLeft className="h-4 w-4" />}
                                />
                            </MenuGroup>

                            {data?.accounts?.enterprise && (
                                <MenuGroup title="Compte société">
                                    <MenuLink
                                        to="/enterprise"
                                        title="Tableau de bord"
                                        icon={<FaHouse className="h-4 w-4" />}
                                    />
                                    <MenuLink
                                        to="/enterprise/history"
                                        title="Historique"
                                        icon={<FaArrowRightArrowLeft className="h-4 w-4" />}
                                    />
                                    <MenuLink
                                        to="/enterprise/history-transfer"
                                        title="Historique de transfert"
                                        icon={<FaArrowRightArrowLeft className="h-4 w-4" />}
                                    />
                                </MenuGroup>
                            )}

                            {data?.accounts?.offshore && (
                                <MenuGroup title="Compte des îles">
                                    <MenuLink
                                        to="/offshore"
                                        title="Compte OffShore"
                                        icon={<GiPalmTree className="h-4 w-4" />}
                                    />
                                </MenuGroup>
                            )}

                            <MenuGroup title="Paramètres">
                                <MenuLink
                                    to="/settings/contacts"
                                    title="Mes bénéficiaires"
                                    icon={<FaUserTie className="h-4 w-4" />}
                                />
                            </MenuGroup>
                        </div>
                        <MenuLink
                            title="Se déconnecter"
                            onClick={() => resetApp()}
                            icon={<FaArrowRightFromBracket className="h-4 w-4" />}
                            className="hover:bg-red-500/50"
                        />
                    </div>
                    <div className="flex flex-col w-5/6 p-10 rounded-xl">
                        <Routes>
                            {/* Personal */}
                            <Route
                                path="/personal"
                                element={
                                    <DashboardPage
                                        bankType={data.bankType}
                                        account={data.accounts.personal}
                                        contacts={data.contacts}
                                        history={data.history.personal}
                                        showIban
                                    />
                                }
                            />
                            <Route
                                path="/personal/history"
                                element={
                                    <HistoryPage
                                        bankType={data.bankType}
                                        account={data.accounts.personal}
                                        history={data.history.personal}
                                        contacts={data.contacts}
                                        showIban
                                    />
                                }
                            />

                            {/* Enterprise */}
                            <Route
                                path="/enterprise"
                                element={
                                    <DashboardPage
                                        bankType={data.bankType}
                                        account={data.accounts.enterprise}
                                        contacts={data.contacts}
                                        history={data.history.enterprise}
                                        showCreateOffshoreAccount={!data?.accounts?.offshore}
                                    />
                                }
                            />
                            <Route
                                path="/enterprise/history"
                                element={
                                    <HistoryPage
                                        bankType={data.bankType}
                                        account={data.accounts.enterprise}
                                        history={data.history.enterprise}
                                        contacts={data.contacts}
                                    />
                                }
                            />
                            <Route
                                path="/enterprise/history-transfer"
                                element={
                                    <HistoryPage
                                        bankType={data.bankType}
                                        account={data.accounts.enterprise}
                                        history={data.history.enterprise_transfer}
                                        contacts={data.contacts}
                                    />
                                }
                            />

                            {/* Offshore */}
                            <Route
                                path="/offshore"
                                element={
                                    <OffshorePage
                                        bankType={data.bankType}
                                        account={data.accounts.offshore}
                                        history={data.history.offshore}
                                    />
                                }
                            />

                            {/* Settings */}
                            <Route
                                path="/settings/contacts"
                                element={
                                    <ContactPage
                                        bankType={data.bankType}
                                        account={data.accounts.personal}
                                        contacts={data.contacts}
                                        history={data.history.personal}
                                    />
                                }
                            />

                            <Route path="*" element={<Navigate to="/personal" replace />} />
                        </Routes>
                    </div>
                </MemoryRouter>
            </Transition>
        </ApplicationContainer>
    );
};
