import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { useTcgCollection } from '../hooks/useTcg';

export const TcgCollection: React.FC = () => {
    const navigate = useNavigate();
    const { collection, loading, refresh } = useTcgCollection();

    useEffect(() => {
        refresh();
    }, []);

    return (
        <>
            <AppTitle
                title={`Ma Collection (${collection.length})`}
                onBackAction={() => navigate('/tcg')}
            />
            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-hidden">
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
                    ) : collection.length === 0 ? (
                        <div className="text-center mt-16 text-gray-500 text-sm leading-relaxed">
                            <p>Aucune carte pour le moment.</p>
                            <p>Récupère tes cartes du jour !</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2.5 overflow-y-auto flex-1 pb-4">
                            {collection.map(card => (
                                <div
                                    key={card.userCardId}
                                    className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                                    onClick={() => navigate(`/tcg/view/${card.userCardId}`, { state: card })}
                                >
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="w-full rounded-md border border-white/10"
                                        style={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
                                    />
                                    <span className="text-[10px] text-gray-400 text-center truncate w-full">
                                        {card.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AppContent>
        </>
    );
};
