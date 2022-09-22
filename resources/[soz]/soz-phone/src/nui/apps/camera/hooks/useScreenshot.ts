import {
    CfxTexture,
    LinearFilter,
    Mesh,
    NearestFilter,
    OrthographicCamera,
    PlaneBufferGeometry,
    RGBAFormat,
    Scene,
    ShaderMaterial,
    UnsignedByteType,
    WebGLRenderer,
    WebGLRenderTarget,
} from '@citizenfx/three';

const ThreeFx = (function () {
    let instance;

    function createInstance(width, height) {
        const cameraRTT: any = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -10000, 10000);
        cameraRTT.position.z = 100;

        const sceneRTT: any = new Scene();

        const rtTexture = new WebGLRenderTarget(width, height, {
            minFilter: LinearFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            type: UnsignedByteType,
        });

        const gameTexture: any = new CfxTexture();
        gameTexture.needsUpdate = true;

        const material = new ShaderMaterial({
            uniforms: { tDiffuse: { value: gameTexture } },
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
            `,
        });

        const plane = new PlaneBufferGeometry(width, height);
        const quad: any = new Mesh(plane, material);
        quad.position.z = -100;
        sceneRTT.add(quad);

        const renderer = new WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.autoClear = false;

        return {
            renderer,
            rtTexture,
            sceneRTT,
            cameraRTT,
            material,
        };
    }

    return {
        getInstance: function (width, height) {
            if (!instance) {
                instance = createInstance(width, height);
            }
            return instance;
        },
    };
})();

export const useScreenshot = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const { renderer, rtTexture, sceneRTT, cameraRTT, material } = ThreeFx.getInstance(width, height);

    document.getElementById('app').appendChild(renderer.domElement);
    document.getElementById('app').style.display = 'none';

    const animate = () => {
        requestAnimationFrame(animate);

        renderer.clear();
        renderer.render(sceneRTT, cameraRTT, rtTexture, true);
    };
    requestAnimationFrame(animate);

    return {
        renderer,
        rtTexture,
        sceneRTT,
        cameraRTT,
        material,
        width,
        height,
    };
};
