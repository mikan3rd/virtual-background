import { TFLite } from '../../core/hooks/useTFLite';
import {
  compileShader,
  createPiplelineStageProgram,
  createTexture,
  glsl,
  readPixelsAsync,
} from '../helpers/webglHelper';
import { inputResolution } from '../../core/helpers/segmentationHelper';

export function buildResizingStage(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  positionBuffer: WebGLBuffer,
  texCoordBuffer: WebGLBuffer,
  tflite: TFLite,
) {
  const fragmentShaderSource = glsl`#version 300 es

    precision highp float;

    uniform sampler2D u_inputFrame;

    in vec2 v_texCoord;

    out vec4 outColor;

    void main() {
      outColor = texture(u_inputFrame, v_texCoord);
    }
  `;

  // TFLite memory will be accessed as float32
  // eslint-disable-next-line no-underscore-dangle
  const tfliteInputMemoryOffset = tflite._getInputMemoryOffset() / 4;

  const [outputWidth, outputHeight] = inputResolution;
  const outputPixelCount = outputWidth * outputHeight;

  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createPiplelineStageProgram(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer);
  const inputFrameLocation = gl.getUniformLocation(program, 'u_inputFrame');
  const outputTexture = createTexture(gl, gl.RGBA8, outputWidth, outputHeight);

  const frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);
  const outputPixels = new Uint8Array(outputPixelCount * 4);

  gl.useProgram(program);
  gl.uniform1i(inputFrameLocation, 0);

  function render() {
    gl.viewport(0, 0, outputWidth, outputHeight);
    gl.useProgram(program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Downloads pixels asynchronously from GPU while rendering the current frame
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    readPixelsAsync(gl, 0, 0, outputWidth, outputHeight, gl.RGBA, gl.UNSIGNED_BYTE, outputPixels);

    for (let i = 0; i < outputPixelCount; i++) {
      const tfliteIndex = tfliteInputMemoryOffset + i * 3;
      const outputIndex = i * 4;
      // eslint-disable-next-line no-param-reassign
      tflite.HEAPF32[tfliteIndex] = outputPixels[outputIndex] / 255;
      // eslint-disable-next-line no-param-reassign
      tflite.HEAPF32[tfliteIndex + 1] = outputPixels[outputIndex + 1] / 255;
      // eslint-disable-next-line no-param-reassign
      tflite.HEAPF32[tfliteIndex + 2] = outputPixels[outputIndex + 2] / 255;
    }
  }

  function cleanUp() {
    gl.deleteFramebuffer(frameBuffer);
    gl.deleteTexture(outputTexture);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
  }

  return { render, cleanUp };
}
