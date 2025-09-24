import { fetchNui } from '@public/nui/fetch';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { FunctionComponent } from 'react';

export const TextureLoaderApp: FunctionComponent = () => {
    useNuiEvent('texture', 'loadImage', async url => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
        })
            .then(response => response.blob())
            .then(blob => {
                // Create blob link to download
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async function () {
                    const base64data = reader.result.toString();

                    const chunkSize = 10_000;
                    const maxIndex = Math.floor((base64data.length - 1) / chunkSize);
                    let index = 0;
                    while (index < maxIndex) {
                        await fetchNui(NuiEvent.TextureReplacerChunk, {
                            url,
                            index,
                            maxIndex,
                            chunk: base64data.substring(chunkSize * index, chunkSize * (index + 1)),
                        });
                        index++;
                    }
                    await fetchNui(NuiEvent.TextureReplacerChunk, {
                        url,
                        index: maxIndex,
                        maxIndex,
                        chunk: base64data.substring(chunkSize * index, base64data.length),
                    });
                };
            });
    });

    return null;
};
