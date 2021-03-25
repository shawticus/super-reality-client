import { WebGL1Renderer, WebGLRenderer, PCFSoftShadowMap, LinearToneMapping } from "three";
export default function makeRenderer(width, height, props = {}) {
  let { canvas } = props as any;
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  let context;
  try {
    context = canvas.getContext("webgl2", { antialias: true });
  } catch (error) {
    context = canvas.getContext("webgl", { antialias: true });
  }
  const options = {
    ...props,
    canvas,
    context,
    antialias: true,
    preserveDrawingBuffer: true
  };
  const { safariWebBrowser } = window as any
  const renderer = safariWebBrowser ? new WebGL1Renderer(options) : new WebGLRenderer(options);
  renderer.toneMapping = LinearToneMapping;
  renderer.toneMappingExposure = 2.0;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setSize(width, height, false);
  return renderer;
}
