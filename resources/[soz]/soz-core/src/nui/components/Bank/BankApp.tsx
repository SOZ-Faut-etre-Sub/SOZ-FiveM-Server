import React, { FunctionComponent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { GiPalmTree } from 'react-icons/gi';
import { MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { BankUiData } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import ArchiveIcon from './assets/archive.svg';
import HomeIcon from './assets/home.svg';
import SignOutIcon from './assets/sign_out.svg';
import UserAddIcon from './assets/user_add.svg';
import { AppContent } from './component/AppContent';
import { ApplicationContainer } from './component/Application';
import { Button } from './component/Button';
import { Card } from './component/Card';
import { Header } from './component/Header';
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
        setData(account => ({
            ...account,
            ...data,
        }));
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
            <AppContent open={showApp}>
                <MemoryRouter>
                    <div className="flex flex-col gap-10 w-3/12">
                        <div className="flex justify-center items-center h-24">
                            <img
                                className="flex-none self-center h-16 px-10"
                                src="https://soz.zerator.com/static/game/images/bank/logo.webp"
                                alt="Fleeca Logo"
                            />
                        </div>
                        <Card className="flex flex-col grow justify-between">
                            <div className="flex flex-col gap-5">
                                <MenuGroup title="Compte personnel">
                                    <MenuLink
                                        to="/personal"
                                        title="Tableau de bord"
                                        icon={<HomeIcon className="size-5" />}
                                    />
                                    <MenuLink
                                        to="/personal/history"
                                        title="Historique"
                                        icon={<ArchiveIcon className="size-5" />}
                                    />
                                </MenuGroup>

                                {data?.accounts?.enterprise && (
                                    <MenuGroup title="Compte société">
                                        <MenuLink
                                            to="/enterprise"
                                            title="Tableau de bord"
                                            icon={<HomeIcon className="size-5" />}
                                        />
                                        <MenuLink
                                            to="/enterprise/history"
                                            title="Historique"
                                            icon={<ArchiveIcon className="size-5" />}
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
                                        icon={<UserAddIcon className="size-5" />}
                                    />
                                </MenuGroup>
                            </div>

                            <Button onClick={() => resetApp()}>
                                <span className="flex gap-2.5 py-1.5 justify-center items-center">
                                    <SignOutIcon className="size-6" /> Se déconnecter
                                </span>
                            </Button>
                        </Card>
                    </div>
                    <div className="flex flex-col w-9/12 gap-10 rounded-xl">
                        <BankHeader />

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
                                        showBankAccountName
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
            </AppContent>
        </ApplicationContainer>
    );
};

const BankHeader: FunctionComponent = () => {
    const location = useLocation();

    const [category, title] = useMemo(() => {
        if (location.pathname.startsWith('/personal')) {
            const category = 'Compte personnel';

            if (location.pathname.endsWith('/history')) {
                return [category, 'Historique'];
            }

            return [category, 'Tableau de bord'];
        } else if (location.pathname.startsWith('/enterprise')) {
            const category = 'Compte société';

            if (location.pathname.endsWith('/history')) {
                return [category, 'Historique'];
            } else if (location.pathname.endsWith('/history-transfer')) {
                return [category, 'Historique de transfert'];
            }

            return [category, 'Tableau de bord'];
        } else if (location.pathname.startsWith('/settings')) {
            const category = 'Paramètres';

            if (location.pathname.endsWith('/contacts')) {
                return [category, 'Mes bénéficiaires'];
            }

            return [category, ''];
        }

        return ['', ''];
    }, [location.pathname]);

    return <Header category={category} title={title} />;
};
