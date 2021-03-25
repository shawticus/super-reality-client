import Editor from "./Editor";
import ElementsSource from "./assets/sources/ElementsSource";
import MyAssetsSource from "./assets/sources/MyAssetsSource";
import AmbientLightNodeEditor from "./properties/AmbientLightNodeEditor";
import AudioNodeEditor from "./properties/AudioNodeEditor";
import BoxColliderNodeEditor from "./properties/BoxColliderNodeEditor";
import DirectionalLightNodeEditor from "./properties/DirectionalLightNodeEditor";
import GroundPlaneNodeEditor from "./properties/GroundPlaneNodeEditor";
import GroupNodeEditor from "./properties/GroupNodeEditor";
import HemisphereLightNodeEditor from "./properties/HemisphereLightNodeEditor";
import ImageNodeEditor from "./properties/ImageNodeEditor";
import LinkNodeEditor from "./properties/LinkNodeEditor";
import ModelNodeEditor from "./properties/ModelNodeEditor";
import PointLightNodeEditor from "./properties/PointLightNodeEditor";
import SceneNodeEditor from "./properties/SceneNodeEditor";
import ScenePreviewCameraNodeEditor from "./properties/ScenePreviewCameraNodeEditor";
import SkyboxNodeEditor from "./properties/SkyboxNodeEditor";
import SpawnPointNodeEditor from "./properties/SpawnPointNodeEditor";
import SpotLightNodeEditor from "./properties/SpotLightNodeEditor";
import TriggerVolumeNodeEditor from "./properties/TriggerVolumeNodeEditor";
import VideoNodeEditor from "./properties/VideoNodeEditor";
import VolumetricNodeEditor from "./properties/VolumetricNodeEditor";
import AmbientLightNode from "xr3ngine-engine/src/editor/nodes/AmbientLightNode";
import AudioNode from "xr3ngine-engine/src/editor/nodes/AudioNode";
import BoxColliderNode from "xr3ngine-engine/src/editor/nodes/BoxColliderNode";
import DirectionalLightNode from "xr3ngine-engine/src/editor/nodes/DirectionalLightNode";
import GroundPlaneNode from "xr3ngine-engine/src/editor/nodes/GroundPlaneNode";
import GroupNode from "xr3ngine-engine/src/editor/nodes/GroupNode";
import HemisphereLightNode from "xr3ngine-engine/src/editor/nodes/HemisphereLightNode";
import FloorPlanNode from "xr3ngine-engine/src/editor/nodes/FloorPlanNode";
import FloorPlanNodeEditor from "./properties/FloorPlanNodeEditor";
import ImageNode from "xr3ngine-engine/src/editor/nodes/ImageNode";
import LinkNode from "xr3ngine-engine/src/editor/nodes/LinkNode";
import ModelNode from "xr3ngine-engine/src/editor/nodes/ModelNode";
import PointLightNode from "xr3ngine-engine/src/editor/nodes/PointLightNode";
import SceneNode from "xr3ngine-engine/src/editor/nodes/SceneNode";
import ScenePreviewCameraNode from "xr3ngine-engine/src/editor/nodes/ScenePreviewCameraNode";
import SkyboxNode from "xr3ngine-engine/src/editor/nodes/SkyboxNode";
import SpawnPointNode from "xr3ngine-engine/src/editor/nodes/SpawnPointNode";
import SpotLightNode from "xr3ngine-engine/src/editor/nodes/SpotLightNode";
import TriggerVolumeNode from "xr3ngine-engine/src/editor/nodes/TriggerVolumeNode";
import VideoNode from "xr3ngine-engine/src/editor/nodes/VideoNode";
import VolumetricNode from "xr3ngine-engine/src/editor/nodes/VolumetricNode";
import ParticleEmitterNodeEditor from "./properties/ParticleEmitterNodeEditor";
import ParticleEmitterNode from "xr3ngine-engine/src/editor/nodes/ParticleEmitterNode";
import BingImagesSource from "./assets/sources/BingImagesSource";
import BingVideosSource from "./assets/sources/BingVideosSource";
import PolySource from "./assets/sources/PolySource";
import SketchfabSource from "./assets/sources/SketchfabSource";
import TenorSource from "./assets/sources/TenorSource";

/**
 * [createEditor used to create editor object and register nodes available to create scene]
 * @param  {[type]} api      [provides the api object]
 * @param  {[type]} settings [provides settings to be Applied]
 * @return {[type]}          [editor]
 */
export function createEditor(api, settings) {
  const editor = new Editor(api, settings);

  editor.registerNode(SceneNode, SceneNodeEditor);
  editor.registerNode(GroupNode, GroupNodeEditor);
  editor.registerNode(ModelNode, ModelNodeEditor);
  editor.registerNode(GroundPlaneNode, GroundPlaneNodeEditor);
  editor.registerNode(BoxColliderNode, BoxColliderNodeEditor);
  editor.registerNode(AmbientLightNode, AmbientLightNodeEditor);
  editor.registerNode(DirectionalLightNode, DirectionalLightNodeEditor);
  editor.registerNode(HemisphereLightNode, HemisphereLightNodeEditor);
  editor.registerNode(SpotLightNode, SpotLightNodeEditor);
  editor.registerNode(PointLightNode, PointLightNodeEditor);
  editor.registerNode(SpawnPointNode, SpawnPointNodeEditor);
  editor.registerNode(SkyboxNode, SkyboxNodeEditor);
  editor.registerNode(FloorPlanNode, FloorPlanNodeEditor);
  editor.registerNode(ImageNode, ImageNodeEditor);
  editor.registerNode(VideoNode, VideoNodeEditor);
  editor.registerNode(VolumetricNode, VolumetricNodeEditor);
  editor.registerNode(AudioNode, AudioNodeEditor);
  editor.registerNode(TriggerVolumeNode, TriggerVolumeNodeEditor);
  editor.registerNode(LinkNode, LinkNodeEditor);
  editor.registerNode(ScenePreviewCameraNode, ScenePreviewCameraNodeEditor);
  editor.registerNode(ParticleEmitterNode, ParticleEmitterNodeEditor);
  editor.registerSource(new ElementsSource(editor));
  editor.registerSource(new MyAssetsSource(editor));
  editor.registerSource(new SketchfabSource(api));
  editor.registerSource(new PolySource(api));
  editor.registerSource(new BingImagesSource(api));
  editor.registerSource(new BingVideosSource(api));
  editor.registerSource(new TenorSource(api));

  return editor;
}
