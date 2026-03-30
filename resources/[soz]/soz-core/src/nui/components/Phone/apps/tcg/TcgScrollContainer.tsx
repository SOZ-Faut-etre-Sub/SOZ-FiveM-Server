import React, { useCallback, useEffect, useRef } from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onScrollEnd?: () => void;
}

export const TcgScrollContainer: React.FC<Props> = ({ children, className = '', style, onScrollEnd }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const didDragRef = useRef(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let startY = 0;
        let startScroll = 0;
        let isDown = false;
        let dragging = false;

        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return; // left click only
            startY = e.clientY;
            startScroll = el.scrollTop;
            isDown = true;
            dragging = false;
            didDragRef.current = false;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;

            const dy = e.clientY - startY;

            if (!dragging && Math.abs(dy) > 10) {
                dragging = true;
                didDragRef.current = true;
                el.style.cursor = 'grabbing';
                el.style.userSelect = 'none';
            }

            if (dragging) {
                el.scrollTop = startScroll - dy;
            }
        };

        const onMouseUp = () => {
            if (dragging) {
                el.style.cursor = '';
                el.style.userSelect = '';
            }
            isDown = false;
            dragging = false;
        };

        // Block clicks that happened after a drag
        const onClickCapture = (e: MouseEvent) => {
            if (didDragRef.current) {
                e.stopPropagation();
                e.preventDefault();
                didDragRef.current = false;
            }
        };

        // Block native image drag that steals pointer events
        const onDragStart = (e: DragEvent) => { e.preventDefault(); };

        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('dragstart', onDragStart);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        // Capture phase so we intercept before React onClick handlers
        el.addEventListener('click', onClickCapture, true);

        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('dragstart', onDragStart);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            el.removeEventListener('click', onClickCapture, true);
        };
    }, []);

    const handleScroll = useCallback(() => {
        if (!onScrollEnd || !scrollRef.current) return;
        const el = scrollRef.current;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
        if (atBottom) onScrollEnd();
    }, [onScrollEnd]);

    return (
        <>
            <style>{`
                .tcg-scroll::-webkit-scrollbar { width: 10px; }
                .tcg-scroll::-webkit-scrollbar-track { background: transparent; }
                .tcg-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 5px; }
                .tcg-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
                .tcg-scroll img { -webkit-user-drag: none; user-drag: none; pointer-events: auto; }
            `}</style>
            <div
                ref={scrollRef}
                className={`overflow-y-auto tcg-scroll ${className}`}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255,255,255,0.15) transparent',
                    ...style,
                }}
                onScroll={handleScroll}
            >
                {children}
            </div>
        </>
    );
};