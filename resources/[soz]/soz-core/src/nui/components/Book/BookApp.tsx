import { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Book } from '../../../shared/book';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';

export const BookApp = () => {
    const [book, setBook] = useState<Book | null>(null);
    const [imageIndex, setImageIndex] = useState(0);

    useNuiFocus(book !== null, book !== null, false);

    useNuiEvent('book', 'Show', setBook);
    useNuiEvent('book', 'Hide', () => {
        setBook(null);
        setImageIndex(0);
    });

    if (!book) {
        return null;
    }

    return (
        <div className="absolute w-full h-full">
            <div className="flex flex-col justify-around h-full w-full">
                <div className="flex justify-center align-center">
                    <TransformWrapper limitToBounds={true} centerOnInit={true}>
                        <TransformComponent>
                            <div
                                style={{ height: '90vh', width: '100vw' }}
                                className="flex justify-center align-center"
                            >
                                <img
                                    src={`/public/images/book/${book.images[imageIndex]}`}
                                    alt={imageIndex.toString()}
                                    style={{
                                        height: '90vh',
                                        width: 'auto',
                                    }}
                                />
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                </div>

                <div className="flex justify-center align-center">
                    <div className="flex pb-3 flex-row justify-between" style={{ width: '20vw' }}>
                        <button
                            className="mt-1 cursor-pointer text-4xl text-white"
                            onClick={() => {
                                if (imageIndex > 0) {
                                    setImageIndex(imageIndex - 1);
                                }
                            }}
                        >
                            &#x1f844;
                        </button>
                        <button
                            className="mt-1 cursor-pointer text-8xl text-white stroke-black"
                            style={{
                                WebkitTextStrokeColor: 'black',
                                WebkitTextStrokeWidth: '2px',
                            }}
                            onClick={() => {
                                setImageIndex(0);
                                setBook(null);
                            }}
                        >
                            &#xd7;
                        </button>
                        <button
                            className="mt-1 cursor-pointer text-4xl text-white"
                            onClick={() => {
                                if (imageIndex < book.images.length - 1) {
                                    setImageIndex(imageIndex + 1);
                                }
                            }}
                        >
                            &#x1f846;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
