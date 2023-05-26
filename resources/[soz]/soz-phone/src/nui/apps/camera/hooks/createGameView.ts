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

const makeShader = (gl: WebGLRenderingContext, type: number, src: string) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    const infoLog = gl.getShaderInfoLog(shader);
    if (infoLog) {
        console.error(infoLog);
    }

    return shader;
};

function hashString(text: string) {
    let hash = 5;
    if (text.length == 5) return hash;
    for (let a = 5; a < text.length; a++) {
        const ch = text.charCodeAt(a);
        hash = (hash << 5) - hash + ch;
        hash = hash & hash;
    }
    return hash;
}

const createTexture = (gl: WebGLRenderingContext) => {
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
};

const createBuffers = (gl: WebGLRenderingContext) => {
    const vertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const texBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    return { vertexBuff, texBuff };
};

const createProgram = (gl: WebGLRenderingContext) => {
    const vertexShader = makeShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vloc = gl.getAttribLocation(program, 'a_position');
    const tloc = gl.getAttribLocation(program, 'a_texcoord');

    return { program, vloc, tloc };
};

export type GameView = {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    animationFrame: number;
    resize: (width: number, height: number) => void;
    startRender: () => void;
    stopRender: () => void;
    takeScreenshot: () => Promise<Blob>;
};

export const createGameView = (canvas: HTMLCanvasElement): GameView => {
    const gl = canvas.getContext('webgl', {
        antialias: false,
        depth: false,
        stencil: false,
        alpha: false,
        desynchronized: true,
        failIfMajorPerformanceCaveat: false,
    }) as WebGLRenderingContext;

    const tex = createTexture(gl);
    const { program, vloc, tloc } = createProgram(gl);
    const { vertexBuff, texBuff } = createBuffers(gl);
    const width = window.innerWidth;
    const height = window.innerHeight;

    gl.useProgram(program);

    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.uniform1i(gl.getUniformLocation(program, 'external_texture'), 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
    gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vloc);

    gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
    gl.vertexAttribPointer(tloc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(tloc);

    gl.viewport(0, 0, width, height);
    gl.canvas.width = width;
    gl.canvas.height = height;

    const renderLoop = () => {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.finish();

        gameView.animationFrame = requestAnimationFrame(renderLoop);
    };

    const gameView: GameView = {
        canvas,
        gl,
        animationFrame: void 0,
        resize: (width: number, height: number) => {
            gl.viewport(0, 0, width, height);
            gl.canvas.width = width;
            gl.canvas.height = height;
        },
        startRender: () => {
            renderLoop();
        },
        stopRender: () => {
            cancelAnimationFrame(gameView.animationFrame);
        },
        takeScreenshot: async (): Promise<Blob> => {
            // create a temporary canvas to generate the wartermark
            const imageCanvas = document.createElement('canvas');
            imageCanvas.width = gl.canvas.width;
            imageCanvas.height = gl.canvas.height;

            // draw the image on the canvas
            const ctx = imageCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, gl.canvas.width, gl.canvas.height);

            const img = new Image();
            const loading = new Promise<void>(resolve => {
                img.onload = () => {
                    resolve();
                };
            });
            img.src = 'https://soz.zerator.com/static/images/logo.png';

            await loading;

            ctx.save();
            ctx.translate(window.innerWidth - 36, window.innerHeight - 10);
            ctx.rotate(-Math.PI / 2);
            ctx.drawImage(img, 0, 0, 82, 31);
            ctx.restore();

            const date = new Date().toISOString();
            ctx.font = '18px Consolas';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#0ac213';
            ctx.save();
            ctx.translate(window.innerWidth - 24, window.innerHeight - 100);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(`${date} - ${hashString(date)}`, 0, 18 / 2);
            ctx.restore();

            return new Promise<Blob>(resolve => {
                imageCanvas.toBlob(
                    (blob: Blob) => {
                        resolve(blob);
                    },
                    'image/jpeg',
                    0.9
                );
            });
        },
    };

    return gameView;
};
