import { Transition } from '@headlessui/react';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { FaArrowRightFromBracket, FaHouse, FaMoneyBillTransfer } from 'react-icons/fa6';
import { GiPalmTree } from 'react-icons/gi';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { BankUiData } from '../../../shared/bank';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useOutside } from '../../hook/outside';
import { MenuGroup } from './component/MenuGroup';
import { MenuLink } from './component/MenuLink';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { OffshorePage } from './pages/OffshorePage';
import { TransferPage } from './pages/TransferPage';

export const BankApp: FunctionComponent = () => {
    const [showApp, setShowApp] = useState<boolean>(false);
    const [account, setAccount] = useState<BankUiData>({} as BankUiData);

    const refOutside = useOutside({
        click: () => setShowApp(false),
    });

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setShowApp(false);
        }
    };

    useNuiFocus(showApp, showApp, showApp, [], showApp);

    useNuiEvent('bank', 'ShowAccount', (data: BankUiData) => {
        setAccount(data);
        setShowApp(true);
    });

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    return (
        <div className="absolute h-full w-full flex justify-center items-center font-sans z-30">
            <div ref={refOutside} className="h-full w-full max-w-[1536px] mx-auto my-auto py-12">
                <Transition
                    className="flex gap-4 bg-gradient-to-br from-[#1c2128] via-[#1c2826] to-[#1c2128] text-white/80 h-full w-full rounded-2xl p-4 overflow-y-auto"
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
                                src="/public/images/bank/logo.webp"
                                alt="Fleeca Logo"
                            />
                            <div className="flex flex-col grow gap-4">
                                <MenuLink to="/" title="Tableau de bord" icon={<FaHouse className="h-4 w-4" />} />
                                <MenuGroup title="Compte personnel">
                                    <MenuLink
                                        to="/personal/transfer"
                                        title="Transfert"
                                        icon={<FaMoneyBillTransfer className="h-4 w-4" />}
                                    />
                                    <MenuLink
                                        to="/personal/history"
                                        title="Historique"
                                        icon={<FaBookOpen className="h-4 w-4" />}
                                    />
                                </MenuGroup>

                                {account?.accounts?.enterprise && (
                                    <MenuGroup title="Compte société">
                                        <MenuLink
                                            to="/enterprise/transfer"
                                            title="Transfert"
                                            icon={<FaMoneyBillTransfer className="h-4 w-4" />}
                                        />
                                        <MenuLink
                                            to="/enterprise/history"
                                            title="Historique"
                                            icon={<FaBookOpen className="h-4 w-4" />}
                                        />
                                        <MenuLink
                                            to="/enterprise/offshore"
                                            title="Compte OffShore"
                                            icon={<GiPalmTree className="h-4 w-4" />}
                                        />
                                    </MenuGroup>
                                )}
                            </div>
                            <MenuLink
                                title="Se déconnecter"
                                onClick={() => setShowApp(false)}
                                icon={<FaArrowRightFromBracket className="h-4 w-4" />}
                                className="hover:bg-red-500/50"
                            />
                        </div>
                        <div className="w-5/6 p-10 bg-white/5 rounded-xl">
                            <Routes>
                                <Route index path="/" element={<DashboardPage {...account} />} />
                                <Route path="/personal/transfer" element={<TransferPage {...account} />} />
                                <Route path="/personal/history" element={<HistoryPage {...account} />} />
                                <Route path="/offshore" element={<OffshorePage {...account} />} />
                                <Route path="/enterprise/transfer" element={<TransferPage {...account} />} />
                                <Route path="/enterprise/history" element={<HistoryPage {...account} />} />
                                <Route path="/enterprise/offshore" element={<OffshorePage {...account} />} />
                            </Routes>
                        </div>
                    </MemoryRouter>
                </Transition>
            </div>
        </div>
    );
};
