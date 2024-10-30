import { GameViewRenderer } from './gameview';

const gameViewRenderer = new GameViewRenderer();

onmessage = function (event) {
    switch (event.data.type) {
        case 'init':
            gameViewRenderer.resize(event.data.width, event.data.height);
            break;

        case 'add':
            gameViewRenderer.addCanvas(
                event.data.uuid,
                event.data.canvas,
                event.data.x,
                event.data.y,
                event.data.options
            );
            break;

        case 'update':
            gameViewRenderer.updateCanvas(
                event.data.uuid,
                event.data.x,
                event.data.y,
                event.data.width,
                event.data.height
            );
            break;

        case 'remove':
            gameViewRenderer.removeCanvas(event.data.uuid);
            break;
    }
};
