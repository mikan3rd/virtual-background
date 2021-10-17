import { BackgroundBlurStage, buildBackgroundBlurStage } from './backgroundBlurStage';
import { BackgroundConfig } from '../../core/helpers/backgroundHelper';
import { BackgroundImageStage, buildBackgroundImageStage } from './backgroundImageStage';
import { PostProcessingConfig } from '../../core/helpers/postProcessingHelper';
import { SegmentationConfig, inputResolutions } from '../../core/helpers/segmentationHelper';
import { TFLite } from '../../core/hooks/useTFLite';
import { buildJointBilateralFilterStage } from './jointBilateralFilterStage';
import { buildResizingStage } from './resizingStage';
import { buildSoftmaxStage } from './softmaxStage';
import { compileShader, createTexture, glsl } from '../helpers/webglHelper';

export function buildWebGL2Pipeline(
  sourceVideoElement: HTMLVideoElement,
  backgroundImage: HTMLImageElement | null,
  backgroundConfig: BackgroundConfig,
  segmentationConfig: SegmentationConfig,
  canvas: HTMLCanvasElement,
  tflite: TFLite,
  addFrameEvent: () => void,
) {
  const vertexShaderSource = glsl`#version 300 es

    in vec2 a_position;
    in vec2 a_texCoord;

    out vec2 v_texCoord;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

  const { videoWidth: frameWidth, videoHeight: frameHeight } = sourceVideoElement;
  const [segmentationWidth, segmentationHeight] = inputResolutions[segmentationConfig.inputResolution];

  const gl = canvas.getContext('webgl2');
  if (gl === null) {
    throw new Error('WebGL2 is not supported');
  }

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  const positionBuffer = gl.createBuffer();
  if (positionBuffer === null) {
    throw new Error('Failed to create position buffer');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  if (texCoordBuffer === null) {
    throw new Error('Failed to create texCoord buffer');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]), gl.STATIC_DRAW);

  // We don't use texStorage2D here because texImage2D seems faster
  // to upload video texture than texSubImage2D even though the latter
  // is supposed to be the recommended way:
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#use_texstorage_to_create_textures
  const inputFrameTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, inputFrameTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // TODO Rename segmentation and person mask to be more specific
  const segmentationTexture = createTexture(gl, gl.RGBA8, segmentationWidth, segmentationHeight);
  if (segmentationTexture === null) {
    throw new Error('Failed to create segmentation texture');
  }

  const personMaskTexture = createTexture(gl, gl.RGBA8, frameWidth, frameHeight);
  if (personMaskTexture === null) {
    throw new Error('Failed to create person mask texture');
  }

  const resizingStage = buildResizingStage(
    gl,
    vertexShader,
    positionBuffer,
    texCoordBuffer,
    segmentationConfig,
    tflite,
  );
  const loadSegmentationStage = buildSoftmaxStage(
    gl,
    vertexShader,
    positionBuffer,
    texCoordBuffer,
    segmentationConfig,
    tflite,
    segmentationTexture,
  );
  const jointBilateralFilterStage = buildJointBilateralFilterStage(
    gl,
    vertexShader,
    positionBuffer,
    texCoordBuffer,
    segmentationTexture,
    segmentationConfig,
    personMaskTexture,
    canvas,
  );
  const backgroundStage =
    backgroundConfig.type === 'blur'
      ? buildBackgroundBlurStage(gl, vertexShader, positionBuffer, texCoordBuffer, personMaskTexture, canvas)
      : buildBackgroundImageStage(gl, positionBuffer, texCoordBuffer, personMaskTexture, backgroundImage, canvas);

  async function render() {
    if (gl === null) {
      return;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputFrameTexture);

    // texImage2D seems faster than texSubImage2D to upload
    // video texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceVideoElement);

    gl.bindVertexArray(vertexArray);

    resizingStage.render();

    addFrameEvent();

    tflite._runInference();

    addFrameEvent();

    loadSegmentationStage.render();
    jointBilateralFilterStage.render();
    backgroundStage.render();
  }

  function updatePostProcessingConfig(postProcessingConfig: PostProcessingConfig) {
    jointBilateralFilterStage.updateSigmaSpace(postProcessingConfig.jointBilateralFilter.sigmaSpace);
    jointBilateralFilterStage.updateSigmaColor(postProcessingConfig.jointBilateralFilter.sigmaColor);

    if (backgroundConfig.type === 'image') {
      const backgroundImageStage = backgroundStage as BackgroundImageStage;
      backgroundImageStage.updateCoverage(postProcessingConfig.coverage);
      backgroundImageStage.updateLightWrapping(postProcessingConfig.lightWrapping);
      backgroundImageStage.updateBlendMode(postProcessingConfig.blendMode);
    } else if (backgroundConfig.type === 'blur') {
      const backgroundBlurStage = backgroundStage as BackgroundBlurStage;
      backgroundBlurStage.updateCoverage(postProcessingConfig.coverage);
    } else {
      // TODO Handle no background in a separate pipeline path
      const backgroundImageStage = backgroundStage as BackgroundImageStage;
      backgroundImageStage.updateCoverage([0, 0.9999]);
      backgroundImageStage.updateLightWrapping(0);
    }
  }

  function cleanUp() {
    backgroundStage.cleanUp();
    jointBilateralFilterStage.cleanUp();
    loadSegmentationStage.cleanUp();
    resizingStage.cleanUp();

    if (gl === null) {
      return;
    }

    gl.deleteTexture(personMaskTexture);
    gl.deleteTexture(segmentationTexture);
    gl.deleteTexture(inputFrameTexture);
    gl.deleteBuffer(texCoordBuffer);
    gl.deleteBuffer(positionBuffer);
    gl.deleteVertexArray(vertexArray);
    gl.deleteShader(vertexShader);
  }

  return { render, updatePostProcessingConfig, cleanUp };
}
