import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TcgCollectionCard } from '../../../../../../shared/tcg/tcg.types';

export const TcgViewer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const card = location.state as TcgCollectionCard | null;

    if (!card) {
        navigate('/tcg/collection');
        return null;
    }

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black/92 z-50"
            onClick={() => navigate('/tcg/collection')}
        >
            <div
                className="relative flex flex-col items-center max-h-[92%] max-w-[92%]"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white text-sm flex items-center justify-center z-50"
                    onClick={() => navigate('/tcg/collection')}
                >
                    ✕
                </button>
                <img
                    src={card.image}
                    alt={card.name}
                    className="w-full rounded-xl"
                    style={{
                        maxHeight: '80vh',
                        objectFit: 'contain',
                        boxShadow: '0 0 40px rgba(185, 103, 255, 0.2), 0 0 80px rgba(0, 240, 255, 0.1)',
                    }}
                />
                <span className="mt-3 text-base font-bold text-white text-center">{card.name}</span>
            </div>
        </div>
    );
};
