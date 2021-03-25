import { LoadGLTF } from "xr3ngine-engine/src/assets/functions/LoadGLTF";
import { GLTFExporter } from "xr3ngine-engine/src/assets/loaders/gltf/GLTFExporter";
import GLTFCache from "xr3ngine-engine/src/editor/caches/GLTFCache";
import TextureCache from "xr3ngine-engine/src/editor/caches/TextureCache";
import EditorInfiniteGridHelper from "xr3ngine-engine/src/editor/classes/EditorInfiniteGridHelper";
import ErrorIcon from "xr3ngine-engine/src/editor/classes/ErrorIcon";
import History from "xr3ngine-engine/src/editor/classes/History";
import AddMultipleObjectsCommand from "xr3ngine-engine/src/editor/commands/AddMultipleObjectsCommand";
import AddObjectCommand from "xr3ngine-engine/src/editor/commands/AddObjectCommand";
import DeselectCommand from "xr3ngine-engine/src/editor/commands/DeselectCommand";
import DeselectMultipleCommand from "xr3ngine-engine/src/editor/commands/DeselectMultipleCommand";
import DuplicateCommand from "xr3ngine-engine/src/editor/commands/DuplicateCommand";
import DuplicateMultipleCommand from "xr3ngine-engine/src/editor/commands/DuplicateMultipleCommand";
import GroupMultipleCommand from "xr3ngine-engine/src/editor/commands/GroupMultipleCommand";
import LoadMaterialSlotCommand from "xr3ngine-engine/src/editor/commands/LoadMaterialSlotCommand";
import LoadMaterialSlotMultipleCommand from "xr3ngine-engine/src/editor/commands/LoadMaterialSlotMultipleCommand";
import RemoveMultipleObjectsCommand from "xr3ngine-engine/src/editor/commands/RemoveMultipleObjectsCommand";
import RemoveObjectCommand from "xr3ngine-engine/src/editor/commands/RemoveObjectCommand";
import ReparentCommand from "xr3ngine-engine/src/editor/commands/ReparentCommand";
import ReparentMultipleCommand from "xr3ngine-engine/src/editor/commands/ReparentMultipleCommand";
import ReparentMultipleWithPositionCommand from "xr3ngine-engine/src/editor/commands/ReparentMultipleWithPositionCommand";
import RotateAroundCommand from "xr3ngine-engine/src/editor/commands/RotateAroundCommand";
import RotateAroundMultipleCommand from "xr3ngine-engine/src/editor/commands/RotateAroundMultipleCommand";
import RotateOnAxisCommand from "xr3ngine-engine/src/editor/commands/RotateOnAxisCommand";
import RotateOnAxisMultipleCommand from "xr3ngine-engine/src/editor/commands/RotateOnAxisMultipleCommand";
import ScaleCommand from "xr3ngine-engine/src/editor/commands/ScaleCommand";
import ScaleMultipleCommand from "xr3ngine-engine/src/editor/commands/ScaleMultipleCommand";
import SelectCommand from "xr3ngine-engine/src/editor/commands/SelectCommand";
import SelectMultipleCommand from "xr3ngine-engine/src/editor/commands/SelectMultipleCommand";
import SetPositionCommand from "xr3ngine-engine/src/editor/commands/SetPositionCommand";
import SetPositionMultipleCommand from "xr3ngine-engine/src/editor/commands/SetPositionMultipleCommand";
import SetPropertiesCommand from "xr3ngine-engine/src/editor/commands/SetPropertiesCommand";
import SetPropertiesMultipleCommand from "xr3ngine-engine/src/editor/commands/SetPropertiesMultipleCommand";
import SetPropertyCommand from "xr3ngine-engine/src/editor/commands/SetPropertyCommand";
import SetPropertyMultipleCommand from "xr3ngine-engine/src/editor/commands/SetPropertyMultipleCommand";
import SetRotationCommand from "xr3ngine-engine/src/editor/commands/SetRotationCommand";
import SetRotationMultipleCommand from "xr3ngine-engine/src/editor/commands/SetRotationMultipleCommand";
import SetScaleCommand from "xr3ngine-engine/src/editor/commands/SetScaleCommand";
import SetScaleMultipleCommand from "xr3ngine-engine/src/editor/commands/SetScaleMultipleCommand";
import SetSelectionCommand from "xr3ngine-engine/src/editor/commands/SetSelectionCommand";
import TranslateCommand from "xr3ngine-engine/src/editor/commands/TranslateCommand";
import TranslateMultipleCommand from "xr3ngine-engine/src/editor/commands/TranslateMultipleCommand";
import { TransformSpace } from "xr3ngine-engine/src/editor/constants/TransformSpace";
import EditorControls, { TransformMode } from "xr3ngine-engine/src/editor/controls/EditorControls";
import FlyControls from "xr3ngine-engine/src/editor/controls/FlyControls";
import InputManager from "xr3ngine-engine/src/editor/controls/InputManager";
import PlayModeControls from "xr3ngine-engine/src/editor/controls/PlayModeControls";
import cloneObject3D from "xr3ngine-engine/src/editor/functions/cloneObject3D";
import { MultiError, RethrownError } from "xr3ngine-engine/src/editor/functions/errors";
import getDetachedObjectsRoots from "xr3ngine-engine/src/editor/functions/getDetachedObjectsRoots";
import getIntersectingNode from "xr3ngine-engine/src/editor/functions/getIntersectingNode";
import isEmptyObject from "xr3ngine-engine/src/editor/functions/isEmptyObject";
import isInputSelected from "xr3ngine-engine/src/editor/functions/isInputSelected";
import makeUniqueName from "xr3ngine-engine/src/editor/functions/makeUniqueName";
import { calculateGLTFPerformanceScores } from "xr3ngine-engine/src/editor/functions/performance";
import resizeShadowCameraFrustum from "xr3ngine-engine/src/editor/functions/resizeShadowCameraFrustum";
import { generateImageFileThumbnail, generateVideoFileThumbnail } from "xr3ngine-engine/src/editor/functions/thumbnails";
import AudioNode from "xr3ngine-engine/src/editor/nodes/AudioNode";
import FloorPlanNode from "xr3ngine-engine/src/editor/nodes/FloorPlanNode";
import GroupNode from "xr3ngine-engine/src/editor/nodes/GroupNode";
import ImageNode from "xr3ngine-engine/src/editor/nodes/ImageNode";
import LinkNode from "xr3ngine-engine/src/editor/nodes/LinkNode";
import ModelNode from "xr3ngine-engine/src/editor/nodes/ModelNode";
import SceneNode from "xr3ngine-engine/src/editor/nodes/SceneNode";
import VideoNode from "xr3ngine-engine/src/editor/nodes/VideoNode";
import VolumetricNode from "xr3ngine-engine/src/editor/nodes/VolumetricNode";
import Renderer from "xr3ngine-engine/src/editor/renderer/Renderer";
import ThumbnailRenderer from "xr3ngine-engine/src/editor/renderer/ThumbnailRenderer";
import TransformGizmo from "xr3ngine-engine/src/scene/classes/TransformGizmo";
import EventEmitter from "eventemitter3";
import {
  AudioListener,
  Clock, Matrix4,
  PerspectiveCamera, PropertyBinding, Quaternion,
  Raycaster,
  Scene, Vector2,
  Vector3
} from "three";
import Api from "./Api";
import AssetManifestSource from "./assets/AssetManifestSource";
import { loadEnvironmentMap } from "./EnvironmentMap";


const tempMatrix1 = new Matrix4();
const tempMatrix2 = new Matrix4();
const tempMatrix3 = new Matrix4();
const tempMatrix4 = new Matrix4();
const tempMatrix5 = new Matrix4();
const tempQuaternion1 = new Quaternion();
const tempQuaternion2 = new Quaternion();
const tempVector1 = new Vector3();

let resolveRenderer;
let rejectRenderer;
const rendererPromise = new Promise((resolve, reject) => {
  resolveRenderer = resolve;
  rejectRenderer = reject;
});

const removeObjectsRoots = [];

/**
 * [Editor used to provide the various tools and properties to create or edit scene]
 * @type {[class]}
 */
export default class Editor extends EventEmitter {
  api: Api;
  settings: any;
  project: any;
  selected: any[];
  selectedTransformRoots: any[];
  history: History;
  renderer: Renderer;
  inputManager: InputManager;
  editorControls: EditorControls;
  flyControls: any;
  playModeControls: any;
  nodeTypes: any;
  nodeEditors: Map<any, any>;
  sources: any[];
  defaultUploadSource: any;
  textureCache: TextureCache;
  gltfCache: GLTFCache;
  scene: SceneNode;
  sceneModified: boolean;
  projectLoaded: boolean;
  camera: PerspectiveCamera;
  audioListener: AudioListener;
  helperScene: Scene;
  grid: EditorInfiniteGridHelper;
  nodes: any[];
  raycaster: Raycaster;
  centerScreenSpace: Vector2;
  clock: Clock;
  disableUpdate: boolean;
  initializing: boolean;
  initialized: boolean;
  sceneLoading: boolean;
  rafId: number;
  thumbnailRenderer: ThumbnailRenderer;
  playing: boolean;

  // initializing component properties with default value.
  constructor(api, settings = {}) {
    super();
    this.api = api;
    this.settings = settings;
    this.project = null;

    this.selected = [];
    this.selectedTransformRoots = [];

    this.history = new History();

    this.renderer = null;
    this.inputManager = null;
    this.editorControls = null;
    this.flyControls = null;
    this.playModeControls = null;

    this.nodeTypes = new Set();
    this.nodeEditors = new Map();
    this.sources = [];
    this.defaultUploadSource = null;

    this.textureCache = new TextureCache();
    this.gltfCache = new GLTFCache();

    this.scene = new SceneNode(this);
    this.sceneModified = false;
    this.projectLoaded = false;

    this.camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.2, 8000);
    this.audioListener = new AudioListener();
    this.camera.add(this.audioListener);
    this.camera.layers.enable(1);
    this.camera.name = "Camera";

    this.helperScene = new Scene();

    this.grid = new EditorInfiniteGridHelper();
    this.helperScene.add(this.grid as any);

    this.nodes = [this.scene];

    this.raycaster = new Raycaster();
    // Center at 0, 0
    this.centerScreenSpace = new Vector2();
    this.clock = new Clock();
    this.disableUpdate = false;
    this.initializing = false;
    this.initialized = false;
    this.sceneLoading = false;
  }

/**
 * [registerNode used to add new object to the scene]
 * @param  {[type]} nodeConstructor [contains constructor properties]
 * @param  {[type]} nodeEditor      [contains editor properties]
 */
  registerNode(nodeConstructor, nodeEditor) {
    this.nodeTypes.add(nodeConstructor);
    this.nodeEditors.set(nodeConstructor, nodeEditor);
  }

/**
 * [getNodeEditor used to get properties of currently selected node]
 * @param  {[type]} node [contains properties of node]
 */
  getNodeEditor(node) {
    return this.nodeEditors.get(node.constructor);
  }

/**
 * [registerSource used to add image, audio, video, asset files to the scene]
 * @param  {[type]} source [contains source file data]
 */
  registerSource(source) {
    this.sources.push(source);

    if (source.uploadSource && !this.defaultUploadSource) {
      this.defaultUploadSource = source;
    }
  }

/**
 * [installAssetSource adding asset using url]
 * @param  {[type]}  manifestUrl [contains url of source]
 */
  async installAssetSource(manifestUrl) {
    const proxiedUrl = this.api.proxyUrl(new URL(manifestUrl, (window as any).location).href);
    const res = await this.api.fetchUrl(proxiedUrl);
    const json = await res.json();
    this.sources.push(new AssetManifestSource(this, json.name, manifestUrl));
    this.emit("settingsChanged");
  }

/**
 * [getSource used to get source from sources array using sourceId]
 * @param  {[type]} sourceId
 * @return {[type]}    source data
 */
  getSource(sourceId) {
    return this.sources.find(source => source.id === sourceId);
  }

/**
 * [setSource emitting event setSource using sourceId]
 */
  setSource(sourceId) {
    this.emit("setSource", sourceId);
  }

/**
 * [emit overriding function to emit events to exicute functions]
 * @param  {[type]} eventName
 * @param  {[type]} args      [contains data used by  event]
 * @return {[type]}           [true if scene is not loading]
 */
  emit(eventName: string | symbol, ...args: any[]): boolean {
    if (!this.sceneLoading) {
      super.emit(eventName, ...args);
      return true;
    }
    return false;
  }

/**
 * [init called when component get initialized]
 * @return {Promise}         [void]
 */
  async init(): Promise<void> {

    // check if component is already initialized then return
    if (this.initialized) {
      return;
    }

    // check if component is initializing
    if (this.initializing) {

      return new Promise((resolve, reject) => {
        let cleanup = null;

        const onInitialize = () => {
          resolve();
          cleanup();
        };

        const onError = err => {
          reject(err);
          cleanup();
        };
    // removing listeners
        cleanup = () => {
          this.removeListener("initialized", onInitialize);
          this.removeListener("error", onError);
        };
    // adding listeners
        this.addListener("initialized", onInitialize);
        this.addListener("error", onError);
      });
    }

    this.initializing = true;

    const tasks = [
            rendererPromise,
            loadEnvironmentMap(),
            ErrorIcon.load(),
            TransformGizmo.load()
          ];

    for (const NodeConstructor of this.nodeTypes) {
      tasks.push(NodeConstructor.load());
    }
    // wait till all Promise get completed
    await Promise.all(tasks);

    // initializing canvas for current scene
    this.inputManager = new InputManager(this.renderer.canvas);

    // initializing controls
    this.flyControls = new FlyControls(this.camera as any, this.inputManager);
    this.editorControls = new EditorControls(this.camera, this, this.inputManager, this.flyControls);
    this.playModeControls = new PlayModeControls(this.inputManager, this.editorControls, this.flyControls);
    this.editorControls.enable();

    // adding listeners
    window.addEventListener("copy", this.onCopy);
    window.addEventListener("paste", this.onPaste);

    this.rafId = requestAnimationFrame(this.update);

    this.initialized = true;

    // marking that component get initialized
    this.emit("initialized");
  }

/**
 * [onEmitSceneModified called when scene get modified]
 */
  onEmitSceneModified() {
    this.sceneModified = true;
    this.emit("sceneModified");
  }

/**
 * [initializeRenderer used to render canvas]
 * @param  {[type]} canvas [ contains canvas data ]
 */
  initializeRenderer(canvas) {
    try {
      this.renderer = new Renderer(this, canvas);
      this.thumbnailRenderer = new ThumbnailRenderer();
      resolveRenderer();
    } catch (error) {
      rejectRenderer(error);
    }
  }

/**
 * [clearCaches used to clear cashe]
 */
  clearCaches() {
    this.textureCache.disposeAndClear();
    this.gltfCache.disposeAndClear();
  }

/**
 * [loadProject used to load the scene]
 * @param  {[type]}  projectFile [contains scene data]
 * @return {Promise}             [scene to render]
 */
  async loadProject(projectFile) {

    // removing listener
    this.removeListener("objectsChanged", this.onEmitSceneModified);
    this.removeListener("sceneGraphChanged", this.onEmitSceneModified);

    // clear caches
    this.clearCaches();

    // remove existing scene
    this.removeObject(this.scene);

    // enabling loading
    this.sceneLoading = true;

    //disabling loading
    this.disableUpdate = true;

    // getting scene data
    const [scene, errors] = await SceneNode.loadProject(this, projectFile);

    // removing loading
    this.sceneLoading = false;

    // enabling updates
    this.disableUpdate = false;

    // initializing loaded scene
    this.scene = scene;

    // setting camera postions
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(new Vector3());
    this.scene.add(this.camera);

    // setting editor controls
    this.editorControls.center.set(0, 0, 0);
    this.editorControls.onSceneSet(scene);

    this.renderer.onSceneSet();

    this.addObject(this.scene, null, null);

    this.deselectAll();

    this.history.clear();

    this.sceneModified = false;

    this.scene.traverse(node => {
      if (node.isNode) {
        node.onRendererChanged();
      }
    });

    if (errors.length === 0) {
      this.emit("projectLoaded");
    }

    this.emit("sceneGraphChanged");

    this.addListener("objectsChanged", this.onEmitSceneModified);
    this.addListener("sceneGraphChanged", this.onEmitSceneModified);

    // check if there is any error then throw error;
    if (errors.length > 0) {
      const error = new MultiError("Errors loading project", errors);
      this.emit("error", error);
      throw error;
    }

    return scene;
  }

 /**
  * [DefaultExportOptions provides properties to export scene]
  */
  static DefaultExportOptions = {
    combineMeshes: true,
    removeUnusedObjects: true
  };

/**
 * [exportScene used to export scene]
 * @param  {[type]}  signal       [ show the Network status]
 * @param  {Object}  [options={}]
 * @return {Promise}              [scene data as object]
 */
  async exportScene(signal, options = {}) {
    const { combineMeshes, removeUnusedObjects } = Object.assign({}, Editor.DefaultExportOptions, options);

    this.deselectAll(false);

    const scene = this.scene;

    const floorPlanNode = scene.findNodeByType(FloorPlanNode);

    if (floorPlanNode) {
      try {
        await floorPlanNode.generate(signal);
      } catch (error){
        console.warn("Failed to generate floorplan", error);
      }
    }

    const clonedScene = cloneObject3D(scene, true);
    const animations = clonedScene.getAnimationClips();

    for (const clip of animations) {
      for (const track of clip.tracks) {
        const { nodeName: uuid } = PropertyBinding.parseTrackName(track.name);

        const object = clonedScene.getObjectByProperty("uuid", uuid);

        if (!object) {
          const originalSceneObject = scene.getObjectByProperty("uuid", uuid);

          if (originalSceneObject) {
            console.log(`Couldn't find object with uuid: "${uuid}" in cloned scene but was found in original scene!`);
          } else {
            console.log(`Couldn't find object with uuid: "${uuid}" in cloned or original scene!`);
          }
        }
      }
    }

    const exportContext = { animations };

    clonedScene.prepareForExport(exportContext);

    if (combineMeshes) {
      await clonedScene.combineMeshes();
    }

    if (removeUnusedObjects) {
      clonedScene.removeUnusedObjects();
    }

    const exporter = new GLTFExporter({
      mode: "glb",
      onlyVisible: false,
      includeCustomExtensions: true,
      animations
    });

    let chunks;

    try {
      chunks = await exporter.exportChunks(clonedScene);
    } catch (error) {
      throw new RethrownError(`Error exporting scene`, error);
    }

    const json = chunks.json;

    const nodeDefs = json.nodes;
    if (nodeDefs) {
      const uuidToIndexMap = {};

      for (let i = 0; i < nodeDefs.length; i++) {
        const nodeDef = nodeDefs[i];

        if (nodeDef.extras && nodeDef.extras.XR3_editor_uuid) {
          uuidToIndexMap[nodeDef.extras.XR3_editor_uuid] = i;
          delete nodeDef.extras.XR3_editor_uuid;

          if (isEmptyObject(nodeDef.extras)) {
            delete nodeDef.extras;
          }
        }
      }
    }

    try {
      const glbBlob = await exporter.exportGLBBlob(chunks);

      let scores;

      if ((options as any).scores) {
        scores = calculateGLTFPerformanceScores(scene, glbBlob, chunks);
      }

      return { glbBlob, chunks, scores };
    } catch (error) {
      throw new RethrownError("Error creating glb blob", error);
    }
  }

/**
 * [getSpawnPosition provides the postion of object inside scene]
 * @return {[type]}        [Spwan position]
 */
  getSpawnPosition(target) {
    return this.getScreenSpaceSpawnPosition(this.centerScreenSpace, target);
  }

  getCursorSpawnPosition(mousePos, target) {
    const rect = this.renderer.canvas.getBoundingClientRect();
    const position = new Vector2();
    position.x = ((mousePos.x - rect.left) / rect.width) * 2 - 1;
    position.y = ((mousePos.y - rect.top) / rect.height) * -2 + 1;
    return this.getScreenSpaceSpawnPosition(position, target);
  }

  getScreenSpaceSpawnPosition(screenSpacePosition, target) {
    this.raycaster.setFromCamera(screenSpacePosition, this.camera);
    const results = this.raycaster.intersectObject(this.scene as any, true);
    const result = getIntersectingNode(results, this.scene);

    if (result && result.distance < 1000) {
      target.copy(result.point);
    } else {
      this.raycaster.ray.at(20, target);
    }

    if (this.editorControls.shouldSnap()) {
      const translationSnap = this.editorControls.translationSnap;

      target.set(
        Math.round(target.x / translationSnap) * translationSnap,
        Math.round(target.y / translationSnap) * translationSnap,
        Math.round(target.z / translationSnap) * translationSnap
      );
    }
  }

  reparentToSceneAtCursorPosition(objects, mousePos) {
    const newPosition = new Vector3();
    this.getCursorSpawnPosition(mousePos, newPosition);
    this.history.execute(new ReparentMultipleWithPositionCommand(this, objects, this.scene, undefined, newPosition));
  }

/**
 * [takeScreenshot ]
 * @param  {[type]}  width
 * @param  {[type]}  height
 * @return {Promise}        [generated screenshot according to height and width]
 */
  async takeScreenshot(width, height) {
    return await this.renderer.takeScreenshot(width, height);
  }

/**
 * [generateFileThumbnail used to create thumbnail from audio as well video file]
 * @param  {[type]}  file
 * @param  {[type]}  width
 * @param  {[type]}  height
 * @return {Promise}        [generated thumbnail data as blob]
 */
  async generateFileThumbnail(file, width, height) {
    const url = URL.createObjectURL(file);
    console.log("URL IS");
    console.log(url);

    let blob;

    if (file.name.toLowerCase().endsWith(".glb")) {
      const { scene } = await LoadGLTF(url);

      blob = await this.thumbnailRenderer.generateThumbnail(scene, width, height);
    } else if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].some(ext => file.name.toLowerCase().endsWith(ext))) {
      blob = await generateImageFileThumbnail(file);
    } else if (file.name.toLowerCase().endsWith(".mp4")) {
      blob = await generateVideoFileThumbnail(file);
    }

    URL.revokeObjectURL(url);

    if (!blob) {
      throw new Error(`Unsupported file type for file: "${file.name}". File must be an image, video, or glb model.`);
    }
    return blob;
  }

/**
 * [enterPlayMode used to enable play mode]
 *
 */
  enterPlayMode() {
    this.playing = true;
    this.deselectAll();
    this.camera.layers.disable(1);
    this.playModeControls.enable();
    this.scene.traverse(node => {
      if (node.isNode) {
        node.onPlay();
      }
    });
    this.emit("playModeChanged");
  }

/**
 * [leavePlayMode used to disable play mode]
 */
  leavePlayMode() {
    this.playing = false;
    this.camera.layers.enable(1);
    this.playModeControls.disable();
    this.scene.traverse(node => {
      if (node.isNode) {
        node.onPause();
      }
    });
    this.emit("playModeChanged");
  }

/**
 * [update used to update components used in editor]
 */
  update = () => {
    if (!this.disableUpdate) {
      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();
      this.scene.updateMatrixWorld();
      this.inputManager.update(delta, time);

      const enableShadows = this.renderer.renderMode.enableShadows;

      this.scene.traverse(node => {
        if (enableShadows && node.isDirectionalLight) {
          resizeShadowCameraFrustum(node, this.scene);
        }

        if (node.isNode) {
          node.onUpdate(delta, time);
        }
      });
      this.flyControls.update(delta);
      this.editorControls.update();

      this.renderer.update(delta, time);
      this.inputManager.reset();
    }

    this.rafId = requestAnimationFrame(this.update);
  };

/**
 * [onResize event handler for resize containers]
 */
  onResize = () => {
    this.inputManager.onResize();
    this.renderer.onResize();
    this.emit("resize");
  };

/**
 * [revert used to revert back the recent changes on the basis of checkpoint]
 * @param  {[type]} checkpointId
 */
  revert(checkpointId) {
    this.history.revert(checkpointId);
  }

/**
 * [undo used to undo changes using history of this component]
 */
  undo() {
    this.history.undo();
  }

/**
 * [redo used to redo changes on the basis of history of component]
 */
  redo() {
    this.history.redo();
  }

/**
 * [select called if we select object on the scene]
 * @param  {[type]}  object
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [updateTransformRoots=true]
 * @return {[type]}                              [data of selected object]
 */
  select(object, useHistory = true, emitEvent = true, updateTransformRoots = true) {
    if (this.selected.indexOf(object) !== -1) {
      return this.selected;
    }

    if (emitEvent) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new SelectCommand(this, object));
    }

    this.selected.push(object);

    if (object.isNode) {
      object.onSelect();
    }

    if (updateTransformRoots) {
      this.updateTransformRoots();
    }

    if (emitEvent) {
      this.emit("selectionChanged");
    }

    return this.selected;
  }

/**
 * [selectMultiple used to select multiple objects on the scene]
 * @param  {[type]}  objects
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [updateTransformRoots=true]
 * @return {[type]}                              [data of selected objects]
 */
  selectMultiple(objects, useHistory = true, emitEvent = true, updateTransformRoots = true) {
    let selectionChanged = false;

    for (let i = 0; i < objects.length; i++) {
      if (this.selected.indexOf(objects[i]) === -1) {
        selectionChanged = true;
        break;
      }
    }

    if (!selectionChanged) {
      return this.selected;
    }

    if (emitEvent) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new SelectMultipleCommand(this, objects));
    }

    for (let i = 0; i < objects.length; i++) {
      this.select(objects[i], false, false, false);
    }

    if (emitEvent) {
      this.emit("selectionChanged");
    }

    if (updateTransformRoots) {
      this.updateTransformRoots();
    }

    return this.selected;
  }

/**
 * [selectAll used to select all objects available in the scene ]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [updateTransformRoots=true]
 * @return {[type]}                              [selected objects]
 */
  selectAll(useHistory = true, emitEvent = true, updateTransformRoots = true) {
    return this.setSelection(this.nodes, useHistory, emitEvent, updateTransformRoots);
  }


/**
 * [deselect used to unselect the selected object]
 * @param  {[type]}  object
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [updateTransformRoots=true]
 * @return {[type]}                              [return selected object]
 */
  deselect(object, useHistory = true, emitEvent = true, updateTransformRoots = true) {
    const index = this.selected.indexOf(object);

    if (index === -1) {
      return this.selected;
    }

    if (emitEvent) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new DeselectCommand(this, object));
    }

    this.selected.splice(index, 1);

    if (object.isNode) {
      object.onDeselect();
    }

    if (emitEvent) {
      this.emit("selectionChanged");
    }

    if (updateTransformRoots) {
      this.updateTransformRoots();
    }

    return this.selected;
  }


/**
 * [deselectMultiple  deselect multiple selected objects]
 * @param  {[type]}  objects
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [updateTransformRoots=true]
 * @return {[type]}                              [selected object]
 */
  deselectMultiple(objects, useHistory = true, emitEvent = true, updateTransformRoots = true) {
    let selectionChanged = false;

    for (let i = 0; i < objects.length; i++) {
      if (this.selected.indexOf(objects[i]) !== -1) {
        selectionChanged = true;
        break;
      }
    }

    if (!selectionChanged) {
      return this.selected;
    }

    if (emitEvent) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new DeselectMultipleCommand(this, objects));
    }

    for (let i = 0; i < objects.length; i++) {
      this.deselect(objects[i], false, false, false);
    }

    if (emitEvent) {
      this.emit("selectionChanged");
    }

    if (updateTransformRoots) {
      this.updateTransformRoots();
    }

    return this.selected;
  }

/**
 * [deselectAll used to deselect all selected]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [updateTransformRoots=true]
 */
  deselectAll(useHistory = true, emitEvent = true, updateTransformRoots = true) {
    return this.setSelection([], useHistory, emitEvent, updateTransformRoots);
  }

/**
 * [toggleSelection used to toggle select and unselect object ]
 * @param  {[type]}  object
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [updateTransformRoots=true]
 */
  toggleSelection(object, useHistory = true, emitEvent = true, updateTransformRoots = true) {
    if (this.selected.indexOf(object) !== -1) {
      return this.deselect(object, useHistory, emitEvent, updateTransformRoots);
    } else {
      return this.select(object, useHistory, emitEvent, updateTransformRoots);
    }
  }

/**
 * [setSelection used to set selection various objects]
 * @param {[type]}  objects
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 * @param {Boolean} [updateTransformRoots=true]
 */
  setSelection(objects, useHistory = true, emitEvent = true, updateTransformRoots = true) {
    if (objects.length === this.selected.length) {
      let equalSelection = true;

      for (let i = 0; i < objects.length; i++) {
        // TODO: Should selection order matter?
        if (this.selected[i] !== objects[i]) {
          equalSelection = false;
          break;
        }
      }

      if (equalSelection) {
        return this.selected;
      }
    }

    if (emitEvent) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new SetSelectionCommand(this, objects));
    }

    const prevSelected = this.selected.slice(0);

    for (let i = this.selected.length - 1; i >= 0; i--) {
      const object = this.selected.pop();

      if (object.isNode && objects.indexOf(object) === -1) {
        object.onDeselect();
      }
    }

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];

      this.selected.push(object);

      if (object.isNode && prevSelected.indexOf(object) === -1) {
        object.onSelect();
      }
    }

    if (emitEvent) {
      this.emit("selectionChanged");
    }

    if (updateTransformRoots) {
      this.updateTransformRoots();
    }

    return this.selected;
  }


/**
 * [addObject used to add an object to the scene]
 * @param {[type]}  object
 * @param {[type]}  parent
 * @param {[type]}  before
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 * @param {Boolean} [selectObject=true]
 * @param {Boolean} [useUniqueName=false]
 */
  addObject(
    object,
    parent,
    before,
    useHistory = true,
    emitEvent = true,
    selectObject = true,
    useUniqueName = false
  ) {
    if (emitEvent && selectObject) {
      this.emit("beforeSelectionChanged");
    }

    // TODO: Add makeUniqueName option
    if (useHistory) {
      return this.history.execute(new AddObjectCommand(this, object, parent, before));
    }

    object.saveParent = true;

    if (parent) {
      if (before) {
        const index = parent.children.indexOf(before);

        if (index === -1) {
          throw new Error("addObject: before object not found");
        }

        parent.children.splice(index, 0, object);
        object.parent = parent;
      } else {
        parent.add(object);
      }
    } else if (object !== this.scene) {
      this.scene.add(object);
    }

    object.traverse(child => {
      if (child.isNode) {
        if (useUniqueName) {
          makeUniqueName(this.scene, child);
        }

        child.onAdd();
        this.nodes.push(child);
      }
    });

    object.updateMatrixWorld(true);

    if (selectObject) {
      this.setSelection([object], false, false);
    }

    if (emitEvent) {
      if (selectObject) {
        this.emit("selectionChanged");
      }

      this.emit("sceneGraphChanged");
    }

    return object;
  }

/**
 * [addMultipleObjects used to add multiple objects to the scene]
 * @param {[type]}  objects
 * @param {[type]}  parent
 * @param {[type]}  before
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 * @param {Boolean} [selectObjects=true]
 * @param {Boolean} [useUniqueName=false]
 */

  addMultipleObjects(
    objects,
    parent,
    before,
    useHistory = true,
    emitEvent = true,
    selectObjects = true,
    useUniqueName = false
  ) {
    if (selectObjects && emitEvent) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new AddMultipleObjectsCommand(this, objects, parent, before));
    }

    const rootObjects = getDetachedObjectsRoots(objects);

    for (let i = 0; i < rootObjects.length; i++) {
      this.addObject(rootObjects[i], parent, before, false, false, false, useUniqueName);
    }

    if (selectObjects) {
      this.setSelection(objects, false, false);
    }

    if (emitEvent) {
      if (selectObjects) {
        this.emit("selectionChanged");
      }

      this.emit("sceneGraphChanged");
    }

    return rootObjects;
  }

  _addMultipleObjectsWithParentsAndBefores(objects, parents, befores, oldNodes, emitEvent = true) {
    // Only use the roots of the objects array so that we don't add objects multiple times
    const rootObjects = getDetachedObjectsRoots(objects);

    // Add objects in reverse order so that befores are added first
    for (let i = rootObjects.length - 1; i >= 0; i--) {
      const rootObject = rootObjects[i];
      const rootIndex = objects.indexOf(rootObject);
      this.addObject(rootObject, parents[rootIndex], befores[rootIndex], false, false, false);
    }

    // Nodes are now out of order. Restore the old nodes list.
    this.nodes.length = 0;

    for (let i = 0; i < oldNodes.length; i++) {
      this.nodes.push(oldNodes[i]);
    }

    if (emitEvent) {
      this.emit("sceneGraphChanged");
    }
  }

/**
 * [removeObject used to remove object from scene]
 * @param  {[type]}  object
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [deselectObject=true]
 * @return {[type]}                        [description]
 */

  removeObject(object, useHistory = true, emitEvent = true, deselectObject = true) {
    if (object.parent === null) return null; // avoid deleting the camera or scene

    if (useHistory) {
      return this.history.execute(new RemoveObjectCommand(this, object));
    }

    object.traverse(child => {
      if (child.isNode) {
        child.onRemove();
        const index = this.nodes.indexOf(child);

        if (index === -1) {
          throw new Error(
            "removeObject: node not found. This is due to removing a node that is no longer in the scene."
          );
        }

        this.nodes.splice(index, 1);
      }
    });

    object.parent.remove(object);

    if (deselectObject) {
      this.deselect(object, false, emitEvent);
    }

    if (emitEvent) {
      this.emit("sceneGraphChanged");
    }

    return object;
  }

/**
 * [removeMultipleObjects used to remove multiple objects from scene]
 * @param  {[type]}  objects
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [deselectObjects=true]
 * @return {[type]}
 */
  removeMultipleObjects(objects, useHistory = true, emitEvent = true, deselectObjects = true) {
    this.getRootObjects(objects, removeObjectsRoots);

    if (useHistory) {
      return this.history.execute(new RemoveMultipleObjectsCommand(this, removeObjectsRoots));
    }

    for (let i = 0; i < removeObjectsRoots.length; i++) {
      this.removeObject(removeObjectsRoots[i], false, false, false);
    }

    if (deselectObjects) {
      this.deselectMultiple(objects, false, emitEvent);
    }

    if (emitEvent) {
      this.emit("sceneGraphChanged");
    }

    return removeObjectsRoots;
  }

/**
 * [removeSelectedObjects used to remove selected objects from scene]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [deselectObjects=true]
 * @return {[type]}
 */
  removeSelectedObjects(useHistory = true, emitEvent = true, deselectObjects = true) {
    return this.removeMultipleObjects(this.selected, useHistory, emitEvent, deselectObjects);
  }

/**
 * [duplicate used to create duplicate of selected object]
 * @param  {[type]}  object
 * @param  {[type]}  parent
 * @param  {[type]}  before
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [selectObject=true]
 */
  duplicate(object, parent, before, useHistory = true, emitEvent = true, selectObject = true) {
    if (emitEvent && selectObject) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new DuplicateCommand(this, object, parent, before));
    }

    if (!object.constructor.canAddNode(this)) {
      return;
    }

    const clonedObject = object.clone();

    clonedObject.traverse(o => {
      if (o.isNode) {
        makeUniqueName(this.scene, o);
      }
    });

    this.addObject(clonedObject, parent || object.parent, before, false, false, false);

    if (selectObject) {
      this.setSelection([clonedObject], false, false, false);
    }

    this.updateTransformRoots();

    if (emitEvent) {
      if (selectObject) {
        this.emit("selectionChanged");
      }

      this.emit("sceneGraphChanged");
    }

    return clonedObject;
  }

/**
 * [duplicateMultiple used to create duplicate of selected objects]
 * @param  {[type]}  objects              [description]
 * @param  {[type]}  parent               [description]
 * @param  {[type]}  before               [description]
 * @param  {Boolean} [useHistory=true]    [description]
 * @param  {Boolean} [emitEvent=true]     [description]
 * @param  {Boolean} [selectObjects=true] [description]
 * @return {[type]}                       [description]
 */
  duplicateMultiple(objects, parent, before, useHistory = true, emitEvent = true, selectObjects = true) {
    if (emitEvent && selectObjects) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new DuplicateMultipleCommand(this, objects, parent, before, selectObjects));
    }

    const validNodes = objects.filter(object => object.constructor.canAddNode(this));
    const roots = getDetachedObjectsRoots(validNodes);
    const duplicatedRoots = roots.map(object => object.clone());

    if (parent) {
      this.addMultipleObjects(duplicatedRoots, parent, before, false, false, false, true);
    } else {
      for (let i = 0; i < roots.length; i++) {
        this.addObject(duplicatedRoots[i], roots[i].parent, undefined, false, false, false, true);
      }
    }

    if (selectObjects) {
      this.setSelection(duplicatedRoots, false, false, false);
    }

    this.updateTransformRoots();

    if (emitEvent) {
      if (selectObjects) {
        this.emit("selectionChanged");
      }

      this.emit("sceneGraphChanged");
    }

    return duplicatedRoots;
  }

/**
 * [duplicateSelected used to create duplicate of selected object]
 * @param  {[type]}  [parent=undefined]
 * @param  {[type]}  [before=undefined]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [selectObject=true]
 * @return {[type]}
 */
  duplicateSelected(
    parent = undefined,
    before = undefined,
    useHistory = true,
    emitEvent = true,
    selectObject = true
  ) {
    this.duplicateMultiple(this.selected, parent, before, useHistory, emitEvent, selectObject);
  }

/**
 * [reparent used to change the parent object of selected object]
 * @param  {[type]}  object
 * @param  {[type]}  newParent
 * @param  {[type]}  newBefore
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [selectObject=true]
 * @return {[type]}
 */
  reparent(object, newParent, newBefore, useHistory = true, emitEvent = true, selectObject = true) {
    if (!object.parent) {
      throw new Error(
        `${object.nodeName || object.type} "${
          object.name
        }" has no parent. Reparent only works on objects that are currently in the scene.`
      );
    }

    if (!newParent) {
      throw new Error("editor.reparent: newParent is undefined");
    }

    if (emitEvent && selectObject) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new ReparentCommand(this, object, newParent, newBefore));
    }

    if (newParent !== object.parent) {
      // Maintain world position when reparenting.
      newParent.updateMatrixWorld();

      tempMatrix1.getInverse(newParent.matrixWorld);

      object.parent.updateMatrixWorld();
      tempMatrix1.multiply(object.parent.matrixWorld);

      object.applyMatrix(tempMatrix1);

      object.updateWorldMatrix(false, false);
    }

    const objectIndex = object.parent.children.indexOf(object);
    object.parent.children.splice(objectIndex, 1);

    if (newBefore) {
      const newObjectIndex = newParent.children.indexOf(newBefore);
      newParent.children.splice(newObjectIndex, 0, object);
    } else {
      newParent.children.push(object);
    }

    object.parent = newParent;

    object.updateMatrixWorld(true);

    if (selectObject) {
      this.setSelection([object], false, false, false);
    }

    this.updateTransformRoots();

    if (emitEvent) {
      if (selectObject) {
        this.emit("selectionChanged");
      }

      this.emit("sceneGraphChanged");
    }

    return object;
  }

  /**
   * [reparentMultiple used to change the parent objects of multiple selected  objects]
   * @param  {[type]}  objects
   * @param  {[type]}  newParent
   * @param  {[type]}  newBefore
   * @param  {Boolean} [useHistory=true]
   * @param  {Boolean} [emitEvent=true]
   * @param  {Boolean} [selectObjects=true]
   * @return {[object]}  [selected objects]
   */
  reparentMultiple(objects, newParent, newBefore, useHistory = true, emitEvent = true, selectObjects = true) {
    if (emitEvent && selectObjects) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new ReparentMultipleCommand(this, objects, newParent, newBefore));
    }

    for (let i = 0; i < objects.length; i++) {
      this.reparent(objects[i], newParent, newBefore, false, false, false);
    }

    if (selectObjects) {
      this.setSelection(objects, false, false, false);
    }

    this.updateTransformRoots();

    if (emitEvent) {
      if (selectObjects) {
        this.emit("selectionChanged");
      }

      this.emit("sceneGraphChanged");
    }

    return objects;
  }

/**
 * [reparentSelected used to change the parent object of selected object]
 * @param  {[type]}  newParent
 * @param  {[type]}  newBefore
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [selectObjects=true]
 */
  reparentSelected(newParent, newBefore, useHistory = true, emitEvent = true, selectObjects = true) {
    return this.reparentMultiple(this.selected, newParent, newBefore, useHistory, emitEvent, selectObjects);
  }

/**
 * [groupMultiple used to group multiple objects]
 * @param  {[type]}  objects
 * @param  {[type]}  groupParent
 * @param  {[type]}  groupBefore
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [selectObject=true]
 * @return {[type]}        [group node]
 */
  groupMultiple(objects, groupParent, groupBefore, useHistory = true, emitEvent = true, selectObject = true) {
    if (emitEvent && selectObject) {
      this.emit("beforeSelectionChanged");
    }

    if (useHistory) {
      return this.history.execute(new GroupMultipleCommand(this, objects, groupParent, groupBefore));
    }

    const groupNode = this.addObject(new GroupNode(this), groupParent, groupBefore, false, false, false);

    for (let i = 0; i < objects.length; i++) {
      this.reparent(objects[i], groupNode, undefined, false, false, false);
    }

    if (selectObject) {
      this.setSelection([groupNode], false, false, false);
    }

    this.updateTransformRoots();

    if (emitEvent) {
      if (selectObject) {
        this.emit("selectionChanged");
      }

      this.emit("sceneGraphChanged");
    }

    return groupNode;
  }

/**
 * [groupSelected used to group selected objects]
 * @param  {[type]}  [groupParent=undefined]
 * @param  {[type]}  [groupBefore=undefined]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @param  {Boolean} [selectObject=true]
 * @return {[type]}
 */
  groupSelected(
     groupParent = undefined,
     groupBefore = undefined,
     useHistory = true,
     emitEvent = true,
     selectObject = true
   ) {
    return this.groupMultiple(
      this.selectedTransformRoots,
      groupParent,
      groupBefore,
      useHistory,
      emitEvent,
      selectObject
    );
  }

/**
 * [setPosition used to position object on scene]
 * @param {[type]}  object
 * @param {[type]}  position
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setPosition(object, position, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetPositionCommand(this, object, position, space));
    }

    if (space === TransformSpace.Local) {
      object.position.copy(position);
    } else {
      object.updateMatrixWorld(); // Update parent world matrices

      tempVector1.copy(position);

      let spaceMatrix;

      if (space === TransformSpace.World) {
        spaceMatrix = object.parent.matrixWorld;
      } else if (space === TransformSpace.LocalSelection) {
        if (this.selected.length > 0) {
          const lastSelectedObject = this.selected[this.selected.length - 1];
          lastSelectedObject.updateMatrixWorld();
          spaceMatrix = lastSelectedObject.parent.matrixWorld;
        } else {
          spaceMatrix = tempMatrix1.identity();
        }
      } else {
        spaceMatrix = space;
      }

      tempMatrix1.getInverse(spaceMatrix);
      tempVector1.applyMatrix4(tempMatrix1);
      object.position.copy(tempVector1);
    }

    object.updateMatrixWorld(true);

    object.onChange("position");

    if (emitEvent) {
      this.emit("objectsChanged", [object], "position");
    }

    return object;
  }

/**
 * [setPositionMultiple used to position multiple objects on the scene]
 * @param {[type]}  objects
 * @param {[type]}  position
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setPositionMultiple(objects, position, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetPositionMultipleCommand(this, objects, position, space));
    }

    if (space === TransformSpace.LocalSelection) {
      if (this.selected.length > 0) {
        const lastSelectedObject = this.selected[this.selected.length - 1];
        lastSelectedObject.updateMatrixWorld();
        space = lastSelectedObject.parent.matrixWorld;
      } else {
        space = tempMatrix1.identity().toString();
      }
    }

    for (let i = 0; i < objects.length; i++) {
      this.setPosition(objects[i], position, space, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "position");
    }

    return objects;
  }

/**
 * [setPositionSelected used to position select object]
 * @param {[type]}  position
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setPositionSelected(position, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    return this.setPositionMultiple(this.selectedTransformRoots, position, space, useHistory, emitEvent);
  }

/**
 * [translate used to move an object to specific postion]
 * @param  {[type]}  object
 * @param  {[type]}  translation
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}  [object]
 */
  translate(object, translation, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new TranslateCommand(this, object, translation, space));
    }

    if (space === TransformSpace.Local) {
      object.position.add(translation);
    } else {
      object.updateMatrixWorld(); // Update parent world matrices
      tempVector1.setFromMatrixPosition(object.matrixWorld);
      tempVector1.add(translation);

      let spaceMatrix;

      if (space === TransformSpace.World) {
        spaceMatrix = object.parent.matrixWorld;
      } else if (space === TransformSpace.LocalSelection) {
        if (this.selected.length > 0) {
          const lastSelectedObject = this.selected[this.selected.length - 1];
          lastSelectedObject.updateMatrixWorld();
          spaceMatrix = lastSelectedObject.parent.matrixWorld;
        } else {
          spaceMatrix = tempMatrix1.identity();
        }
      } else {
        spaceMatrix = space;
      }

      tempMatrix1.copy(spaceMatrix).invert();
      tempVector1.applyMatrix4(tempMatrix1);
      object.position.copy(tempVector1);
    }

    object.updateMatrixWorld(true);

    object.onChange("position");

    if (emitEvent) {
      this.emit("objectsChanged", [object], "position");
    }

    return object;
  }

/**
 * [translateMultiple is used when multiple objects are selected]
 * @param  {[type]}  objects
 * @param  {[type]}  translation
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}  [selected objects]
 */
  translateMultiple(objects, translation, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new TranslateMultipleCommand(this, objects, translation, space));
    }

    if (space === TransformSpace.LocalSelection) {
      if (this.selected.length > 0) {
        const lastSelectedObject = this.selected[this.selected.length - 1];
        lastSelectedObject.updateMatrixWorld();
        space = lastSelectedObject.parent.matrixWorld;
      } else {
        space = tempMatrix1.identity().toString();
      }
    }

    for (let i = 0; i < objects.length; i++) {
      this.translate(objects[i], translation, space, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "position");
    }

    return objects;
  }

/**
 * [translateSelected handler to transform multiple selected objects]
 * @param  {[type]}  translation
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}  [multiple selected objects]
 */
  translateSelected(translation, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    return this.translateMultiple(this.selectedTransformRoots, translation, space, useHistory, emitEvent);
  }

/**
 * [setRotation used to rotate a single object]
 * @param {[type]}  object
 * @param {[type]}  rotation
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setRotation(object, rotation, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetRotationCommand(this, object, rotation, space));
    }

    if (space === TransformSpace.Local) {
      object.rotation.copy(rotation);
    } else {
      object.updateMatrixWorld(); // Update parent world matrices

      let spaceMatrix;

      if (space === TransformSpace.World) {
        spaceMatrix = object.parent.matrixWorld;
      } else if (space === TransformSpace.LocalSelection) {
        if (this.selected.length > 0) {
          const lastSelectedObject = this.selected[this.selected.length - 1];
          lastSelectedObject.updateMatrixWorld();
          spaceMatrix = lastSelectedObject.parent.matrixWorld;
        } else {
          spaceMatrix = tempMatrix1.identity();
        }
      } else {
        spaceMatrix = space;
      }

      const newWorldQuaternion = tempQuaternion1.setFromEuler(rotation);
      const inverseParentWorldQuaternion = tempQuaternion2.setFromRotationMatrix(spaceMatrix).inverse();
      const newLocalQuaternion = inverseParentWorldQuaternion.multiply(newWorldQuaternion);
      object.quaternion.copy(newLocalQuaternion);
    }

    object.updateMatrixWorld(true);

    object.onChange("rotation");

    if (emitEvent) {
      this.emit("objectsChanged", [object], "rotation");
    }

    return object;
  }

  setRotationMultiple(objects, rotation, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetRotationMultipleCommand(this, objects, rotation, space));
    }

    if (space === TransformSpace.LocalSelection) {
      if (this.selected.length > 0) {
        const lastSelectedObject = this.selected[this.selected.length - 1];
        lastSelectedObject.updateMatrixWorld();
        space = lastSelectedObject.parent.matrixWorld;
      } else {
        space = tempMatrix1.identity().toString();
      }
    }

    for (let i = 0; i < objects.length; i++) {
      this.setRotation(objects[i], rotation, space, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "rotation");
    }

    return objects;
  }

/**
 * [setRotationSelected used when multiple objects are selected to rotate]
 * @param {[type]}  rotation
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setRotationSelected(rotation, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    return this.setRotationMultiple(this.selectedTransformRoots, rotation, space, useHistory, emitEvent);
  }

/**
 * [rotateOnAxis used to rotate selected object on given axis]
 * @param  {[type]}  object
 * @param  {[type]}  axis
 * @param  {[type]}  angle
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {Boolean}
 */
  rotateOnAxis(object, axis, angle, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new RotateOnAxisCommand(this, object, axis, angle, space));
    }

    if (space === TransformSpace.Local) {
      object.rotateOnAxis(axis, angle);
    } else if (space === TransformSpace.World) {
      object.rotateOnWorldAxis(axis, angle);
    } else {
      object.updateMatrixWorld(); // Update parent world matrices

      let spaceMatrix;

      if (space === TransformSpace.LocalSelection) {
        if (this.selected.length > 0) {
          const lastSelectedObject = this.selected[this.selected.length - 1];
          lastSelectedObject.updateMatrixWorld();
          space = lastSelectedObject.parent.matrixWorld;
        } else {
          space = tempMatrix1.identity().toString();
        }
      } else {
        spaceMatrix = space;
      }

      tempMatrix1.getInverse(spaceMatrix);
      tempVector1.copy(axis).applyMatrix4(tempMatrix1);

      object.rotateOnAxis(tempVector1, angle);
    }

    object.updateMatrixWorld(true);

    object.onChange("position");

    if (emitEvent) {
      this.emit("objectsChanged", [object], "position");
    }

    return object;
  }

/**
 * [rotateOnAxisMultiple multiple selected objects on the given axis]
 * @param  {[type]}  objects
 * @param  {[type]}  axis
 * @param  {[type]}  angle
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}
 */
  rotateOnAxisMultiple(objects, axis, angle, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new RotateOnAxisMultipleCommand(this, objects, axis, angle, space));
    }

    if (space === TransformSpace.LocalSelection) {
      if (this.selected.length > 0) {
        const lastSelectedObject = this.selected[this.selected.length - 1];
        lastSelectedObject.updateMatrixWorld();
        space = lastSelectedObject.parent.matrixWorld;
      } else {
        space = tempMatrix1.identity().toString();
      }
    }

    for (let i = 0; i < objects.length; i++) {
      this.rotateOnAxis(objects[i], axis, angle, space, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "rotation");
    }

    return objects;
  }

/**
 * [rotateOnAxisSelected is used when multiple objects are selected to rotate]
 * @param  {[type]}  axis
 * @param  {[type]}  angle
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}
 */
  rotateOnAxisSelected(axis, angle, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    return this.rotateOnAxisMultiple(this.selectedTransformRoots, axis, angle, space, useHistory, emitEvent);
  }

/**
 * [rotateAround modifies both the position and the rotation of the object]
 * @param  {[type]}  object
 * @param  {[type]}  pivot
 * @param  {[type]}  axis
 * @param  {[type]}  angle
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}
 */
  rotateAround(object, pivot, axis, angle, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new RotateAroundCommand(this, object, pivot, axis, angle));
    }

    object.updateMatrixWorld();

    const matrixWorld = tempMatrix1.copy(object.matrixWorld);
    const inverseParentMatrixWorld = object.parent.matrixWorld.clone().invert();

    const pivotToOriginMatrix = tempMatrix3.makeTranslation(-pivot.x, -pivot.y, -pivot.z);
    const originToPivotMatrix = tempMatrix4.makeTranslation(pivot.x, pivot.y, pivot.z);

    const rotationMatrix = tempMatrix5.makeRotationAxis(axis, angle);

    matrixWorld
      .premultiply(pivotToOriginMatrix)
      .premultiply(rotationMatrix)
      .premultiply(originToPivotMatrix)
      .premultiply(inverseParentMatrixWorld)
      .decompose(object.position, object.quaternion, object.scale);

    object.updateMatrixWorld();

    if (emitEvent) {
      this.emit("objectsChanged", [object], "matrix");
    }

    return object;
  }

/**
 * [rotateAroundMultiple modifies both the position and the rotation of the multiple objects ]
 * @param  {[type]}  objects
 * @param  {[type]}  pivot
 * @param  {[type]}  axis
 * @param  {[type]}  angle
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}
 */
  rotateAroundMultiple(objects, pivot, axis, angle, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new RotateAroundMultipleCommand(this, objects, pivot, axis, angle));
    }

    for (let i = 0; i < objects.length; i++) {
      this.rotateAround(objects[i], pivot, axis, angle, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "matrix");
    }

    return objects;
  }

/**
 * [rotateAroundSelected used when multiple objects are selected]
 * @param  {[type]}  pivot
 * @param  {[type]}  axis
 * @param  {[type]}  angle
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}
 */
  rotateAroundSelected(pivot, axis, angle, useHistory = true, emitEvent = true) {
    return this.rotateAroundMultiple(this.selectedTransformRoots, pivot, axis, angle, useHistory, emitEvent);
  }

/**
 * [scale used to increase size of object according to the scaling coordinates]
 * @param  {[type]}  object                       [selected object to scale]
 * @param  {[type]}  scale                        [contains coordinates to scale]
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}                               [selected object]
 */
  scale(object, scale, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new ScaleCommand(this, object, scale, space));
    }

    if (space === TransformSpace.World && (scale.x !== scale.y || scale.x !== scale.z || scale.y !== scale.z)) {
      console.warn("Scaling an object in world space with a non-uniform scale is not supported");
    }

    object.scale.multiply(scale);

    object.updateMatrixWorld(true);

    object.onChange("scale");

    if (emitEvent) {
      this.emit("objectsChanged", [object], "scale");
    }

    return object;
  }

/**
 * [scaleMultiple used to increase size of multiple selected objects]
 * @param  {[type]}  objects                      [contains array of select objects]
 * @param  {[type]}  scale                        [contains scaling coordinates]
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}                               [selected objects]
 */
  scaleMultiple(objects, scale, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new ScaleMultipleCommand(this, objects, scale, space));
    }

    for (let i = 0; i < objects.length; i++) {
      this.scale(objects[i], scale, space, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "scale");
    }

    return objects;
  }

/**
 * [scaleSelected used when multiple objects are selected]
 * @param  {[type]}  scale
 * @param  {[type]}  [space=TransformSpace.Local]
 * @param  {Boolean} [useHistory=true]
 * @param  {Boolean} [emitEvent=true]
 * @return {[type]}
 */
  scaleSelected(scale, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    return this.scaleMultiple(this.selectedTransformRoots, scale, space, useHistory, emitEvent);
  }

/**
 * [setScale used to scale object according to scaling coordinates]
 * @param {[type]}  object
 * @param {[type]}  scale
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setScale(object, scale, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetScaleCommand(this, object, scale, space));
    }

    if (space === TransformSpace.Local) {
      tempVector1.set(
        scale.x === 0 ? Number.EPSILON : scale.x,
        scale.y === 0 ? Number.EPSILON : scale.y,
        scale.z === 0 ? Number.EPSILON : scale.z
      );

      object.scale.copy(tempVector1);
    } else {
      object.updateMatrixWorld(); // Update parent world matrices

      tempVector1.copy(scale);

      let spaceMatrix;

      if (space === TransformSpace.World) {
        spaceMatrix = object.parent.matrixWorld;
      } else if (space === TransformSpace.LocalSelection) {
        if (this.selected.length > 0) {
          const lastSelectedObject = this.selected[this.selected.length - 1];
          lastSelectedObject.updateMatrixWorld();
          spaceMatrix = lastSelectedObject.parent.matrixWorld;
        } else {
          spaceMatrix = tempMatrix1.identity();
        }
      } else {
        spaceMatrix = space;
      }

      tempMatrix1.getInverse(spaceMatrix);
      tempVector1.applyMatrix4(tempMatrix1);

      tempVector1.set(
        tempVector1.x === 0 ? Number.EPSILON : tempVector1.x,
        tempVector1.y === 0 ? Number.EPSILON : tempVector1.y,
        tempVector1.z === 0 ? Number.EPSILON : tempVector1.z
      );

      object.scale.copy(tempVector1);
    }

    object.updateMatrixWorld(true);

    object.onChange("scale");

    if (emitEvent) {
      this.emit("objectsChanged", [object], "scale");
    }

    return object;
  }

/**
 * [setScaleMultiple used to scale multiple objects]
 * @param {[type]}  objects
 * @param {[type]}  scale
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setScaleMultiple(objects, scale, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetScaleMultipleCommand(this, objects, scale, space));
    }

    if (space === TransformSpace.LocalSelection) {
      if (this.selected.length > 0) {
        const lastSelectedObject = this.selected[this.selected.length - 1];
        lastSelectedObject.updateMatrixWorld();
        space = lastSelectedObject.parent.matrixWorld;
      } else {
        space = tempMatrix1.identity().toString();
      }
    }

    for (let i = 0; i < objects.length; i++) {
      this.setScale(objects[i], scale, space, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "scale");
    }

    return objects;
  }

/**
 * [setScaleSelected used when multiple objects are selected]
 * @param {[type]}  scale
 * @param {[type]}  [space=TransformSpace.Local]
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setScaleSelected(scale, space = TransformSpace.Local, useHistory = true, emitEvent = true) {
    return this.setScaleMultiple(this.selectedTransformRoots, scale, space, useHistory, emitEvent);
  }

/**
 * [setProperty used to set specific property to the selected object]
 * @param {[type]}  object
 * @param {[type]}  propertyName
 * @param {[type]}  value
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 * @param {Boolean} [disableCopy=false]
 */
  setProperty(object, propertyName, value, useHistory = true, emitEvent = true, disableCopy = false) {
    if (useHistory) {
      return this.history.execute(new SetPropertyCommand(this, object, propertyName, value, disableCopy));
    }

    if (value && value.copy && !disableCopy) {
      object[propertyName].copy(value);
    } else {
      object[propertyName] = value;
    }

    if (object.onChange) {
      object.onChange(propertyName);
    }

    if (emitEvent) {
      this.emit("objectsChanged", [object], propertyName);
    }

    return object;
  }

/**
 * [setPropertyMultiple used to set propery to multiple selected objects]
 * @param {[type]}  objects
 * @param {[type]}  propertyName
 * @param {[type]}  value
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setPropertyMultiple(objects, propertyName, value, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetPropertyMultipleCommand(this, objects, propertyName, value));
    }

    for (let i = 0; i < objects.length; i++) {
      this.setProperty(objects[i], propertyName, value, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, propertyName);
    }

    return objects;
  }
/**
 * [setPropertySelected used when multiple objects are selected]
 * @param {[type]}  propertyName
 * @param {[type]}  value
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setPropertySelected(propertyName, value, useHistory = true, emitEvent = true) {
    return this.setPropertyMultiple(this.selected, propertyName, value, useHistory, emitEvent);
  }

/**
 * [setProperties used to set multiple properties to selected object]
 * @param {[type]}  object
 * @param {[type]}  properties
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setProperties(object, properties, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetPropertiesCommand(this, object, properties));
    }

    for (const propertyName in properties) {
      if (!Object.prototype.hasOwnProperty.call(properties, propertyName)) continue;

      const value = properties[propertyName];

      if (value && value.copy) {
        object[propertyName].copy(value);
      } else {
        object[propertyName] = value;
      }
    }

    object.onChange();

    if (emitEvent) {
      this.emit("objectsChanged", [object]);
    }

    return object;
  }

/**
 * [setPropertiesMultiple used to set multiple properties of multiple selected objects]
 * @param {[type]}  objects
 * @param {[type]}  properties
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setPropertiesMultiple(objects, properties, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new SetPropertiesMultipleCommand(this, objects, properties));
    }

    for (let i = 0; i < objects.length; i++) {
      this.setProperties(objects[i], properties, false, false);
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects);
    }

    return objects;
  }

/**
 * [setPropertiesSelected used when multiple objects are selected]
 * @param {[type]}  properties
 * @param {Boolean} [useHistory=true]
 * @param {Boolean} [emitEvent=true]
 */
  setPropertiesSelected(properties, useHistory = true, emitEvent = true) {
    return this.setPropertiesMultiple(this.selected, properties, useHistory, emitEvent);
  }

  loadMaterialSlot(object, subPieceId, materialSlotId, materialId, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(new LoadMaterialSlotCommand(this, object, subPieceId, materialSlotId, materialId));
    }

    object.loadMaterialSlot(subPieceId, materialSlotId, materialId).catch(console.error);

    if (object.onChange) {
      object.onChange("materialSlot");
    }

    if (emitEvent) {
      this.emit("objectsChanged", [object], "materialSlot");
    }

    return object;
  }

  loadMaterialSlotMultiple(objects, subPieceId, materialSlotId, materialId, useHistory = true, emitEvent = true) {
    if (useHistory) {
      return this.history.execute(
        new LoadMaterialSlotMultipleCommand(this, objects, subPieceId, materialSlotId, materialId)
      );
    }

    for (const object of objects) {
      object.loadMaterialSlot(subPieceId, materialSlotId, materialId).catch(console.error);

      if (object.onChange) {
        object.onChange("materialSlot");
      }
    }

    if (emitEvent) {
      this.emit("objectsChanged", objects, "materialSlot");
    }

    return objects;
  }

  loadMaterialSlotSelected(subPieceId, materialSlotId, materialId, useHistory = true, emitEvent = true) {
    return this.loadMaterialSlotMultiple(this.selected, subPieceId, materialSlotId, materialId, useHistory, emitEvent);
  }

/**
 * [getRootObjects used to find root objects ]
 * @param  {[type]}  objects
 * @param  {Array}   [target=[]]
 * @param  {Boolean} [filterUnremovable=true]
 * @param  {Boolean} [filterUntransformable=false]
 * @return {[type]}                                
 */
  getRootObjects(objects, target = [], filterUnremovable = true, filterUntransformable = false) {
    target.length = 0;

    // Recursively find the nodes in the tree with the lowest depth
    const traverse = curObject => {
      if (
        objects.indexOf(curObject) !== -1 &&
        !(filterUnremovable && !curObject.parent) &&
        !(filterUntransformable && curObject.disableTransform)
      ) {
        target.push(curObject);
        return;
      }

      const children = curObject.children;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.isNode) {
          traverse(child);
        }
      }
    };

    traverse(this.scene);

    return target;
  }

  getTransformRoots(objects, target = []) {
    return this.getRootObjects(objects, target, true, true);
  }

  updateTransformRoots() {
    this.getTransformRoots(this.selected, this.selectedTransformRoots);
  }

  onCopy = event => {
    if (isInputSelected()) {
      return;
    }

    event.preventDefault();

    // TODO: Prevent copying objects with a disabled transform
    if (this.selected.length > 0) {
      event.clipboardData.setData(
        "application/vnd.editor.nodes",
        JSON.stringify({ nodeUUIDs: this.selected.map(node => node.uuid) })
      );
    }
  };

  onPaste = event => {
    if (isInputSelected()) {
      return;
    }

    event.preventDefault();

    let data;

    if ((data = event.clipboardData.getData("application/vnd.editor.nodes")) !== "") {
      const { nodeUUIDs } = JSON.parse(data);

      if (!Array.isArray(nodeUUIDs)) {
        return;
      }

      const nodes = nodeUUIDs.map(uuid => this.scene.getObjectByUUID(uuid)).filter(uuid => uuid !== undefined);

      this.duplicateMultiple(nodes, null, null);
    } else if ((data = event.clipboardData.getData("text")) !== "") {
      try {
        const url = new URL(data);
        this.addMedia(url.href, null, null).catch(error => this.emit("error", error));
      } catch (e) {
        console.warn("Clipboard contents did not contain a valid url");
      }
    }
  };

  async addMedia(url, parent, before) {
    let contentType = "";

    const { hostname } = new URL(url);

    try {
      contentType = (await this.api.getContentType(url)) || "";
    } catch (error) {
      console.warn(`Couldn't fetch content type for url ${url}. Using LinkNode instead.`);
    }

    let node;

    if (contentType.startsWith("model/gltf")) {
      node = new ModelNode(this);
      this.getSpawnPosition(node.position);
      this.addObject(node, parent, before);
      node.initialScale = "fit";
      await node.load(url);
    } else if (contentType.startsWith("video/") || hostname === "www.twitch.tv") {
      node = new VideoNode(this);
      this.getSpawnPosition(node.position);
      this.addObject(node, parent, before);
      await node.load(url);
    } else if (contentType.startsWith("image/")) {
      node = new ImageNode(this);
      this.getSpawnPosition(node.position);
      this.addObject(node, parent, before);
      await node.load(url);
    } else if (contentType.startsWith("audio/")) {
      node = new AudioNode(this);
      this.getSpawnPosition(node.position);
      this.addObject(node, parent, before);
      await node.load(url);
     } else if(url.contains(".drcs")) {
      console.log("Dracosis volumetric file detected");
      node = new VolumetricNode(this);
      this.getSpawnPosition(node.position);
      this.addObject(node, parent, before);
     }
     else {
      node = new LinkNode(this);
      this.getSpawnPosition(node.position);
      node.href = url;
      this.addObject(node, parent, before);
    }

    return node;
  }

  spawnGrabbedObject(object) {
    if (this.editorControls.transformMode === TransformMode.Placement) {
      this.removeSelectedObjects();
    }

    if (!object.disableTransform) {
      this.getSpawnPosition(object.position);
    }

    this.addObject(object, null, null);

    if (!object.disableTransform) {
      this.editorControls.setTransformMode(TransformMode.Placement, object.useMultiplePlacementMode);
    }
  }

  incrementGridHeight() {
    this.setGridHeight(this.grid.position.y + 1.5);
  }

  decrementGridHeight() {
    this.setGridHeight(this.grid.position.y - 1.5);
  }

  setGridHeight(value) {
    this.grid.position.y = value;
    this.emit("gridHeightChanged", value);
  }

  toggleGridVisible() {
    this.grid.visible = !this.grid.visible;
    this.emit("gridVisibilityChanged", this.grid.visible);
  }

  dispose() {
    this.clearCaches();

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
