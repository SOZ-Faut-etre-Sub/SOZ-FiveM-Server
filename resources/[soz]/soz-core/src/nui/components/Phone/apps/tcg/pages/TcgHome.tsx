import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TcgCardData } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { useTcgClaim, useTcgDailyStatus } from '../hooks/useTcg';

export const TcgHome: React.FC = () => {
    const navigate = useNavigate();
    const { status, loading: statusLoading, refresh } = useTcgDailyStatus();
    const { loading: claimLoading, claim } = useTcgClaim();
    const [obtained, setObtained] = useState<TcgCardData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        refresh();
    }, []);

    const handleClaim = async () => {
        setObtained([]);
        setError(null);
        const res = await claim();
        if (res) {
            if (res.success) {
                setObtained(res.cards);
            } else {
                setError(res.message ?? 'Erreur');
            }
            refresh();
        }
    };

    const canClaim = status && status.remainingToday > 0;

    return (
        <>
            <AppTitle title="TCG" />
            <AppContent>
                <div className="flex flex-col items-center h-full p-4 overflow-y-auto">
                    {/* Status */}
                    <div className="flex flex-col items-center gap-1 mb-5">
                        {statusLoading ? (
                            <p className="text-sm text-gray-400">Chargement...</p>
                        ) : status ? (
                            <>
                                <span className="text-5xl font-black text-cyan-400 leading-none">
                                    {status.remainingToday}
                                </span>
                                <span className="text-xs text-gray-400">
                                    carte{status.remainingToday !== 1 ? 's' : ''} disponible
                                    {status.remainingToday !== 1 ? 's' : ''}
                                </span>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">Erreur de chargement</p>
                        )}
                    </div>

                    {/* Claim button */}
                    <button
                        className={`w-full max-w-[260px] py-3 px-6 rounded-xl text-sm font-bold uppercase tracking-wider ${
                            canClaim
                                ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-black'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={handleClaim}
                        disabled={!canClaim || claimLoading}
                    >
                        {claimLoading ? 'Ouverture...' : canClaim ? 'Ouvrir mes cartes' : 'Déjà récupérées'}
                    </button>

                    {error && <p className="text-xs text-red-400 mt-3 text-center">{error}</p>}

                    {/* Obtained cards */}
                    {obtained.length > 0 && (
                        <div className="mt-6 w-full text-center">
                            <p className="text-sm font-bold text-yellow-400 mb-3 tracking-wider">
                                Cartes obtenues !
                            </p>
                            <div className="flex justify-center gap-3 flex-wrap">
                                {obtained.map((card, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1">
                                        <img
                                            src={card.image}
                                            alt={card.name}
                                            className="w-[110px] h-[165px] object-cover rounded-lg border-2 border-purple-400/50"
                                            style={{
                                                boxShadow: '0 4px 20px rgba(185, 103, 255, 0.3)',
                                            }}
                                        />
                                        <span className="text-[11px] text-gray-300">{card.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Collection button */}
                    <button
                        className="mt-auto mb-2 py-3 px-8 rounded-xl border border-white/15 text-gray-400 text-sm font-semibold"
                        onClick={() => navigate('/tcg/collection')}
                    >
                        Ma Collection
                    </button>
                </div>
            </AppContent>
        </>
    );
};
