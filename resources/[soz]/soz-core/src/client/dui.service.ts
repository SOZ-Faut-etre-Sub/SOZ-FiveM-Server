import { uuidv4 } from '@core/utils';

export class DUIRenderer {
    private duiObject: number | null = null;
    private textureDict: string = uuidv4();
    private textureName: string = uuidv4();
    private isReady: boolean = false;
    private lastMessage: string = '';

    constructor(
        private url: string,
        private width: number = 1280,
        private height: number = 720
    ) {}

    public initialize(): void {
        this.duiObject = CreateDui(this.url, this.width, this.height);

        if (!this.duiObject) {
            console.error('Failed to create DUI object');
            return;
        }

        const duiHandle = GetDuiHandle(this.duiObject);
        const texture = CreateRuntimeTxd(this.textureDict);

        CreateRuntimeTextureFromDuiHandle(texture, this.textureName, duiHandle);

        this.isReady = true;
    }

    public setUrl(newUrl: string): void {
        if (this.duiObject) {
            this.url = newUrl;
            SetDuiUrl(this.duiObject, newUrl);
        }
    }

    public sendMessage(message: string) {
        if (message === this.lastMessage) return;

        SendDuiMessage(this.duiObject, JSON.stringify({ message }));
        this.lastMessage = message;
    }

    public render(
        x: number,
        y: number,
        width: number,
        height: number,
        align: 'center' | 'left' = 'center',
        heading: number = 0.0,
        r: number = 255,
        g: number = 255,
        b: number = 255,
        a: number = 255
    ): void {
        if (!this.isReady) return;

        const [screenWidth, screenHeight] = GetActiveScreenResolution();

        width = width / screenWidth;
        height = height / screenHeight;

        if (align === 'left') {
            x = x / screenWidth + width / 2;
        }

        DrawSprite(this.textureDict, this.textureName, x, y, width, height, heading, r, g, b, a);
    }

    public destroy(): void {
        if (this.duiObject) {
            DestroyDui(this.duiObject);
            this.duiObject = null;
            this.isReady = false;
            this.lastMessage = '';
        }
    }
}
