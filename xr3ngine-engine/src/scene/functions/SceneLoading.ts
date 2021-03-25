import { AssetLoader } from '../../assets/components/AssetLoader';
import { isClient } from "../../common/functions/isClient";
import { isServer } from "../../common/functions/isServer";
import { Engine } from '../../ecs/classes/Engine';
import { EngineEvents } from '../../ecs/classes/EngineEvents';
import { Entity } from "../../ecs/classes/Entity";
import { addComponent, createEntity, getMutableComponent } from '../../ecs/functions/EntityFunctions';
import { SceneTagComponent } from '../components/Object3DTagComponents';
import { SceneObjectLoadingSchema } from '../constants/SceneObjectLoadingSchema';
import { SceneData } from "../interfaces/SceneData";
import { SceneDataComponent } from "../interfaces/SceneDataComponent";

export function loadScene(scene: SceneData): void {
  const loadPromises = [];
  let loaded = 0;
  if (isClient) {
    console.warn(Engine.scene);
    console.warn(scene);
    EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.ENTITY_LOADED, left: loadPromises.length });
  }
  Object.keys(scene.entities).forEach(key => {
    const sceneEntity = scene.entities[key];
    const entity = createEntity();
    addComponent(entity, SceneTagComponent);
    sceneEntity.components.forEach(component => {
      loadComponent(entity, component);
      if (isServer && component.name === 'gltf-model') {
        // dont load glb model if dont need to parse colliders
        if(!component.data.parseColliders) return;
       // its add unic id from entityId, entityId gives editor to both of side (client have same scene data as a server).
       // needed to syncronize network Objects, like dynamic network rigidBody or cars.
       const loaderComponent = getMutableComponent(entity, AssetLoader);
       loaderComponent.entityIdFromScenaLoader = sceneEntity;
     } else
      if (isClient && component.name === 'gltf-model') {
        const loaderComponent = getMutableComponent(entity, AssetLoader);
        // its add unic id from entityId, entityId gives editor to both of side (client have same scene data as a server).
        // needed to syncronize network Objects, like dynamic network rigidBody or cars.
        loaderComponent.entityIdFromScenaLoader = sceneEntity;
        loadPromises.push(new Promise<void>((resolve, reject) => {
          if (loaderComponent.onLoaded === null || loaderComponent.onLoaded === undefined) {
          }
          loaderComponent.onLoaded.push(() => {
            loaded++;
            resolve()
            EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.ENTITY_LOADED, left: (loadPromises.length - loaded) });
          });
        }));
      }
    });
  });
  Promise.all(loadPromises).then(() => {
    EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.SCENE_LOADED });
  });
}

export function loadComponent(entity: Entity, component: SceneDataComponent): void {
  const name = component.name.replace(/-\d+/, "").replace(" ", "")
  // Override for loading mesh colliders

  if (SceneObjectLoadingSchema[name] === undefined)
    return console.warn("Couldn't load ", name);

  const componentSchema = SceneObjectLoadingSchema[name];
  // for each component in component name, call behavior
  componentSchema.behaviors?.forEach(b => {
    // For each value, from component.data
    const values = {};
    b.values?.forEach(val => {
      // Does it have a from and to field? Let's map to that
      if (val['from'] !== undefined) {
        values[val['to']] = component.data[val['from']];
        // Its only for DEBUG, allow load Models glb adding in dev mode
        // ************************* change url from https:// to http://
      //  console.warn('process.env.LOCAL_BUILD');
      //  console.warn(process.env.LOCAL_BUILD == 'true');
        /*
        if (process.env.NODE_ENV == 'production') {
          if (val['from'] == 'src') {
            values[val['to']] = 'http'+ values[val['to']].substring('https'.length, values[val['to']].length);
          }
        }
        */
        // ************************
      }
      else {
        // Otherwise raw data
        values[val] = component.data[val];
      }
    });
    // run behavior after load model
    if ((b as any).onLoaded) values['onLoaded'] = (b as any).onLoaded;
    // Invoke behavior with args and spread args
    b.behavior(entity, { ...b.args, objArgs: { ...b.args?.objArgs, ...values } });
  });

  // for each component in component name, add component
  componentSchema.components?.forEach(c => {
    // For each value, from component.data, add to args object
    const values = c.values ? c.values.map(val => component.data[val]) : {};
    // Add component with args
    addComponent(entity, c.type, values);
  });
}
