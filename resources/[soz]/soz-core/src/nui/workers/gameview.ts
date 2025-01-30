type GameCanvas = GameCanvasOptions & {
    x: number;
    y: number;
    width: number;
    height: number;
    options: GameCanvasOptions;
};

export type GameCanvasOptions = {
    cantBeHidden?: boolean;
    disableGameClone?: boolean;
    blur?: boolean;
    rounded?: number;
    circle?: boolean;
};

const vertexShaderSrc = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;
  uniform mat3 u_matrix;
  varying vec2 textureCoordinate;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    textureCoordinate = a_texcoord;
  }
`;

const fragmentShaderSrc = `
varying highp vec2 textureCoordinate;
uniform sampler2D external_texture;
void main()
{
  gl_FragColor = texture2D(external_texture, textureCoordinate);
}
`;

function attachShader(gl: WebGLRenderingContext, program: WebGLProgram, type: number, src: string): WebGLShader {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, src);
    gl.attachShader(program, shader);

    return shader;
}

function compileAndLinkShaders(gl: WebGLRenderingContext, program: WebGLProgram, vs: WebGLShader, fs: WebGLShader) {
    gl.compileShader(vs);
    gl.compileShader(fs);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return;
    }

    console.error('Link failed:', gl.getProgramInfoLog(program));
    console.error('vs log:', gl.getShaderInfoLog(vs));
    console.error('fs log:', gl.getShaderInfoLog(fs));

    throw new Error('Failed to compile shaders');
}

function createTexture(gl: WebGLRenderingContext): WebGLTexture {
    const tex = gl.createTexture();

    const texPixels = new Uint8Array([0, 0, 255, 255]);

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, texPixels);

    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // Magic hook sequence
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // Reset
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return tex;
}

function createBuffers(gl: WebGLRenderingContext): {
    vertexBuff: WebGLBuffer;
    texBuff: WebGLBuffer;
} {
    const vertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const texBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    return { vertexBuff, texBuff };
}

function createProgram(gl: WebGLRenderingContext): {
    program: WebGLProgram;
    vloc: GLint;
    tloc: GLint;
} {
    const program = gl.createProgram();

    const vertexShader = attachShader(gl, program, gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = attachShader(gl, program, gl.FRAGMENT_SHADER, fragmentShaderSrc);

    compileAndLinkShaders(gl, program, vertexShader, fragmentShader);

    gl.useProgram(program);

    const vloc = gl.getAttribLocation(program, 'a_position');
    const tloc = gl.getAttribLocation(program, 'a_texcoord');

    return { program, vloc, tloc };
}

export class GameViewRenderer {
    private rootCanvas: OffscreenCanvas;
    private gameCanvas: OffscreenCanvasRenderingContext2D;

    private gl: WebGLRenderingContext;

    private globalHide = false;
    private targetCanvas: Record<string, GameCanvas> = {};

    private fpsLimit = 30;
    private animationFrame: number;
    private lastFrameTimeStamp: DOMHighResTimeStamp = performance.now();

    constructor() {
        this.rootCanvas = new OffscreenCanvas(1, 1);

        const gl = this.rootCanvas.getContext('webgl', {
            alpha: false,
            antialias: false,
            depth: false,
            desynchronized: true,
            failIfMajorPerformanceCaveat: false,
            powerPreference: 'high-performance',
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            stencil: false,
        });

        if (!gl) {
            throw new Error('Failed to acquire webgl context for GameViewRenderer');
        }

        this.gl = gl;

        const tex = createTexture(gl);
        const { program, vloc, tloc } = createProgram(gl);
        const { vertexBuff, texBuff } = createBuffers(gl);

        gl.useProgram(program);

        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.uniform1i(gl.getUniformLocation(program, 'external_texture'), 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
        gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vloc);

        gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
        gl.vertexAttribPointer(tloc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(tloc);

        this.render();
    }

    resize(width: number, height: number) {
        this.gl.viewport(0, 0, width, height);
        this.gl.canvas.width = width;
        this.gl.canvas.height = height;
    }

    setFpsLimit(fps: number) {
        this.fpsLimit = fps;
    }

    enable() {
        if (this.animationFrame) return;

        this.render();
    }

    disable() {
        if (!this.animationFrame) return;

        cancelAnimationFrame(this.animationFrame);
        this.gameCanvas.reset();
        this.animationFrame = null;
    }

    show() {
        this.globalHide = false;
    }

    hide() {
        this.globalHide = true;
    }

    setGameCanvas(canvas: OffscreenCanvas) {
        this.gameCanvas = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: false,
        });
    }

    addCanvas(uuid: string, x: number, y: number, width: number, height: number, options: GameCanvasOptions) {
        if (this.targetCanvas[uuid]) return;

        this.targetCanvas[uuid] = { x, y, width, height, options };
    }

    updateCanvas(uuid: string, x: number, y: number, width: number, height: number, options: GameCanvasOptions) {
        const target = this.targetCanvas[uuid];
        if (!target) return;

        target.x = x;
        target.y = y;
        target.width = width;
        target.height = height;
        target.options = { ...target.options, ...options };
    }

    removeCanvas(uuid: string) {
        delete this.targetCanvas[uuid];
    }

    private render = async () => {
        const now = performance.now();
        const delta = now - this.lastFrameTimeStamp;

        if (delta < 1000 / this.fpsLimit) {
            this.animationFrame = requestAnimationFrame(this.render);
            return;
        }

        this.lastFrameTimeStamp = now;

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.finish();

        if (!this.gameCanvas) {
            this.animationFrame = requestAnimationFrame(this.render);
            return;
        }

        this.gameCanvas.reset();

        for (const { x, y, width, height, options } of Object.values(this.targetCanvas)) {
            if (this.globalHide && !options.cantBeHidden) continue;
            if (options.disableGameClone) continue;

            this.gameCanvas.filter = 'none';

            if (options.rounded || options.circle) {
                this.gameCanvas.save();
            }

            if (options.rounded) {
                this.gameCanvas.beginPath();
                this.gameCanvas.moveTo(x + options.rounded, y);
                this.gameCanvas.lineTo(x + width - options.rounded, y);
                this.gameCanvas.quadraticCurveTo(x + width, y, x + width, y + options.rounded);
                this.gameCanvas.lineTo(x + width, y + height - options.rounded);
                this.gameCanvas.quadraticCurveTo(x + width, y + height, x + width - options.rounded, y + height);
                this.gameCanvas.lineTo(x + options.rounded, y + height);
                this.gameCanvas.quadraticCurveTo(x, y + height, x, y + height - options.rounded);
                this.gameCanvas.lineTo(x, y + options.rounded);
                this.gameCanvas.quadraticCurveTo(x, y, x + options.rounded, y);
                this.gameCanvas.closePath();
            }

            if (options.circle) {
                this.gameCanvas.beginPath();
                this.gameCanvas.arc(x + width / 2, y + height / 2, height / 2, 0, Math.PI * 2, false);
                this.gameCanvas.clip();
            }

            if (options.rounded || options.circle) {
                this.gameCanvas.clip();
            }

            if (options.blur) {
                this.gameCanvas.filter = 'blur(5px)';
            }

            this.gameCanvas.drawImage(this.rootCanvas, x, y, width, height, x, y, width, height);

            if (options.rounded || options.circle) {
                this.gameCanvas.restore();
            }
        }

        this.animationFrame = requestAnimationFrame(this.render);
    };
}
