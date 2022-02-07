import {
    OrthographicCamera,
    Scene,
    WebGLRenderTarget,
    LinearFilter,
    NearestFilter,
    RGBAFormat,
    UnsignedByteType,
    CfxTexture,
    ShaderMaterial,
    PlaneBufferGeometry,
    Mesh,
    WebGLRenderer
} from '@citizenfx/three';

class ScreenshotRequest {
    encoding: 'jpg' | 'png' | 'webp';
    quality: number;
    headers: any;

    correlation: string;

    resultURL: string;

    targetURL: string;
    targetField: string;
}

export class ScreenshotUI {
    renderer: any;
    rtTexture: any;
    sceneRTT: any;
    cameraRTT: any;
    material: any;
    request: ScreenshotRequest;

    initialize() {
        window.addEventListener('resize', event => {
            this.resize();
        });

        const cameraRTT: any = new OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000 );
        cameraRTT.position.z = 100;

        const sceneRTT: any = new Scene();

        const rtTexture = new WebGLRenderTarget( window.innerWidth/1.5, window.innerHeight/1.5, { minFilter: LinearFilter, magFilter: NearestFilter, format: RGBAFormat, type: UnsignedByteType } );
        const gameTexture: any = new CfxTexture( );
        gameTexture.needsUpdate = true;

        const material = new ShaderMaterial( {

            uniforms: { "tDiffuse": { value: gameTexture } },
            vertexShader: `
			varying vec2 vUv;

			void main() {
				vUv = vec2(uv.x, 1.0-uv.y); // fuck gl uv coords
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
`,
            fragmentShader: `
			varying vec2 vUv;
			uniform sampler2D tDiffuse;

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );
			}
`

        } );

        this.material = material;

        const plane = new PlaneBufferGeometry( window.innerWidth/1.5, window.innerHeight/1.5 );
        const quad: any = new Mesh( plane, material );
        quad.position.z = -100;
        sceneRTT.add( quad );

        const renderer = new WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.5 );
        renderer.autoClear = false;

        document.getElementById('app').appendChild(renderer.domElement);
        document.getElementById('app').style.display = 'none';

        this.renderer = renderer;
        this.rtTexture = rtTexture;
        this.sceneRTT = sceneRTT;
        this.cameraRTT = cameraRTT;

        this.animate = this.animate.bind(this);

        requestAnimationFrame(this.animate);
    }

    resize() {
        const cameraRTT: any = new OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000 );
        cameraRTT.position.z = 100;

        this.cameraRTT = cameraRTT;

        const sceneRTT: any = new Scene();

        const plane = new PlaneBufferGeometry( window.innerWidth/1.5, window.innerHeight/1.5 );
        const quad: any = new Mesh( plane, this.material );
        quad.position.z = -100;
        sceneRTT.add( quad );

        this.sceneRTT = sceneRTT;

        this.rtTexture = new WebGLRenderTarget( window.innerWidth/1.5, window.innerHeight/1.5, { minFilter: LinearFilter, magFilter: NearestFilter, format: RGBAFormat, type: UnsignedByteType } );

        this.renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.5 );
    }

    animate() {
        requestAnimationFrame(this.animate);

        this.renderer.clear();
        this.renderer.render(this.sceneRTT, this.cameraRTT, this.rtTexture, true);

        if (this.request) {
            const request = this.request;
            this.request = null;
        }
    }

    generateImage(): string {
        // read the screenshot
        const read = new Uint8Array(window.innerWidth/1.5 * window.innerHeight/1.5 * 4);
        this.renderer.readRenderTargetPixels(this.rtTexture, 0, 0, window.innerWidth/1.5, window.innerHeight/1.5, read);

        // create a temporary canvas to compress the image
        const canvas = document.createElement('canvas');
        canvas.style.display = 'inline';
        canvas.width = window.innerWidth/1.5;
        canvas.height = window.innerHeight/1.5;

        // draw the image on the canvas
        const d = new Uint8ClampedArray(read.buffer);

        const cxt = canvas.getContext('2d');
        cxt.putImageData(new ImageData(d, window.innerWidth/1.5, window.innerHeight/1.5), 0, 0);

        // actual encoding
        return canvas.toDataURL('image/png', 0.5);
    }
}
