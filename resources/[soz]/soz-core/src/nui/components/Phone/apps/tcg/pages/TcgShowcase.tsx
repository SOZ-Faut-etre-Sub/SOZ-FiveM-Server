import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { useTcgShowcase } from '../hooks/useTcg';

export const TcgShowcase: React.FC = () => {
    const navigate = useNavigate();
    const { items, loading, refresh } = useTcgShowcase();

    useEffect(() => { refresh(); }, []);

    return (
        <>
            <AppTitle title="Vitrine" onBackAction={() => navigate('/tcg')} />
            <AppContent>
                <div className="flex flex-col h-full overflow-y-auto">
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
                    ) : items.length === 0 ? (
                        <div className="text-center mt-16 text-gray-500 text-sm leading-relaxed">
                            <p>La vitrine est vide pour le moment.</p>
                            <p className="text-[10px] mt-1">Expose tes cartes depuis ta collection !</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 p-3 pb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex flex-col items-center">
                                    <img
                                        src={item.cardImage}
                                        alt={item.cardName}
                                        className="w-full rounded-xl border border-white/10"
                                        style={{
                                            maxHeight: '55vh',
                                            objectFit: 'contain',
                                            boxShadow: '0 0 30px rgba(255, 140, 50, 0.15), 0 0 60px rgba(255, 80, 150, 0.1)',
                                        }}
                                    />
                                    <div className="mt-2 text-center">
                                        <span className="text-xs text-orange-400 font-bold">{item.username}</span>
                                        {item.description ? (
                                            <span className="text-xs text-gray-400"> : {item.description}</span>
                                        ) : null}
                                    </div>
                                    <span className="text-[9px] text-gray-500 mt-0.5">{item.cardName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AppContent>
        </>
    );
};
