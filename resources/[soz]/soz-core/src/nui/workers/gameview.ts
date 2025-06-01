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
precision highp float;
varying highp vec2 textureCoordinate;
uniform sampler2D external_texture;

// Canvas dimensions
uniform vec2 u_resolution;

// Shape properties
uniform vec4 u_rect; // x, y, width, height
uniform float u_rounded;
uniform bool u_circle;
uniform bool u_blur;
uniform bool u_hidden;

// Blur parameters
uniform float u_blurAmount;

float roundedRectangleSDF(vec2 position, vec2 box, float radius) {
  vec2 q = abs(position) - box + radius;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

float circleSDF(vec2 position, float radius) {
  return length(position) - radius;
}

// Simple blur function
vec4 gaussianBlur(sampler2D texture, vec2 uv, float blurAmount) {
  // Use a fixed radius for more predictable results
  const int RADIUS = 5;

  // Calculate pixel size for sampling
  vec2 pixelSize = 1.0 / u_resolution;

  // Initialize color accumulator and weight sum
  vec4 color = vec4(0.0);
  float weightSum = 0.0;

  // Use a constant for sigma that produces visible blur
  float sigma = max(blurAmount, 1.0);
  float twoSigmaSquare = 2.0 * sigma * sigma;

  // Sample in a square pattern around the current pixel
  for (int y = -RADIUS; y <= RADIUS; y++) {
    for (int x = -RADIUS; x <= RADIUS; x++) {
      // Calculate the weight using the Gaussian function
      float distance = float(x * x + y * y);
      float weight = exp(-distance / twoSigmaSquare);

      // Apply offset and sample
      vec2 offset = vec2(float(x), float(y)) * pixelSize * blurAmount;
      color += texture2D(texture, uv + offset) * weight;
      weightSum += weight;
    }
  }

  // Normalize by total weight to preserve brightness
  return color / weightSum;
}

void main() {
  // If hidden, don't render
  if (u_hidden) {
    discard;
    return;
  }

  // Normalized coordinates of this fragment within canvas
  vec2 uv = textureCoordinate;

  // Check if pixel is inside the rect
  vec2 position = vec2(uv.x * u_resolution.x, (1.0 - uv.y) * u_resolution.y);
  vec2 rectPos = vec2(u_rect.x, u_rect.y);
  vec2 rectSize = vec2(u_rect.z, u_rect.w);

  // Check if we're in the bounding rect
  if (position.x < rectPos.x || position.x > rectPos.x + rectSize.x ||
      position.y < rectPos.y || position.y > rectPos.y + rectSize.y) {
    discard;
    return;
  }

  // Adjust position to be relative to rectangle center
  vec2 centeredPos = position - (rectPos + rectSize * 0.5);

  float distance;
  if (u_circle) {
    // Use circle SDF
    distance = circleSDF(centeredPos, min(rectSize.x, rectSize.y) * 0.5);
  } else if (u_rounded > 0.0) {
    // Use rounded rect SDF
    distance = roundedRectangleSDF(centeredPos, rectSize * 0.5, u_rounded);
  } else {
    // Regular rectangle (always inside)
    distance = -1.0;
  }

  // If outside the shape, discard
  if (distance > 0.0) {
    discard;
    return;
  }

  // Apply texture with or without blur
  vec4 color;
  if (u_blur) {
    color = gaussianBlur(external_texture, uv, u_blurAmount);
  } else {
    color = texture2D(external_texture, uv);
  }

  gl_FragColor = color;
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
    uniforms: {
        resolution: WebGLUniformLocation;
        rect: WebGLUniformLocation;
        rounded: WebGLUniformLocation;
        circle: WebGLUniformLocation;
        blur: WebGLUniformLocation;
        blurAmount: WebGLUniformLocation;
        hidden: WebGLUniformLocation;
    };
} {
    const program = gl.createProgram();

    const vertexShader = attachShader(gl, program, gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = attachShader(gl, program, gl.FRAGMENT_SHADER, fragmentShaderSrc);

    compileAndLinkShaders(gl, program, vertexShader, fragmentShader);

    gl.useProgram(program);

    const vloc = gl.getAttribLocation(program, 'a_position');
    const tloc = gl.getAttribLocation(program, 'a_texcoord');

    const uniforms = {
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        rect: gl.getUniformLocation(program, 'u_rect'),
        rounded: gl.getUniformLocation(program, 'u_rounded'),
        circle: gl.getUniformLocation(program, 'u_circle'),
        blur: gl.getUniformLocation(program, 'u_blur'),
        blurAmount: gl.getUniformLocation(program, 'u_blurAmount'),
        hidden: gl.getUniformLocation(program, 'u_hidden'),
    };

    return { program, vloc, tloc, uniforms };
}

export class GameViewRenderer {
    private gameCanvas: OffscreenCanvas;

    private gl: WebGLRenderingContext;
    private uniforms: {
        resolution: WebGLUniformLocation;
        rect: WebGLUniformLocation;
        rounded: WebGLUniformLocation;
        circle: WebGLUniformLocation;
        blur: WebGLUniformLocation;
        blurAmount: WebGLUniformLocation;
        hidden: WebGLUniformLocation;
    };

    private globalHide = false;
    private targetCanvas: Record<string, GameCanvas> = {};

    private fpsLimit = 30;
    private animationFrame: number;
    private lastFrameTimeStamp: DOMHighResTimeStamp = performance.now();

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
        this.clearCanvas();
        this.animationFrame = null;
    }

    show() {
        this.globalHide = false;
    }

    hide() {
        this.globalHide = true;
    }

    setGameCanvas(canvas: OffscreenCanvas) {
        this.gameCanvas = canvas;

        const gl = this.gameCanvas.getContext('webgl', {
            alpha: true,
            antialias: true,
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
        const { program, vloc, tloc, uniforms } = createProgram(gl);
        this.uniforms = uniforms;

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

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.render();
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

    private clearCanvas() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.finish();
    }

    private render = async () => {
        const now = performance.now();
        const delta = now - this.lastFrameTimeStamp;

        if (delta < 1000 / this.fpsLimit) {
            this.animationFrame = requestAnimationFrame(this.render);
            return;
        }

        this.lastFrameTimeStamp = now;

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.uniform2f(this.uniforms.resolution, this.gl.canvas.width, this.gl.canvas.height);

        for (const { x, y, width, height, options } of Object.values(this.targetCanvas)) {
            if (this.globalHide && !options.cantBeHidden) continue;
            if (options.disableGameClone) continue;

            this.gl.uniform4f(this.uniforms.rect, x, y, width, height);
            this.gl.uniform1f(this.uniforms.rounded, options.rounded || 0);
            this.gl.uniform1i(this.uniforms.circle, options.circle ? 1 : 0);
            this.gl.uniform1i(this.uniforms.blur, options.blur ? 1 : 0);
            this.gl.uniform1f(this.uniforms.blurAmount, options.blur ? 2.0 : 0.0);
            this.gl.uniform1i(this.uniforms.hidden, 0);

            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        }

        this.gl.finish();

        this.animationFrame = requestAnimationFrame(this.render);
    };
}
