import { Mesh } from "three";
import { mergeBufferGeometries } from "xr3ngine-engine/src/common/classes/BufferGeometryUtils";
import { isStatic } from "../functions/StaticMode";
import asyncTraverse from "../functions/asyncTraverse";
import keysEqual from "../functions/keysEqual";
import hashImage from "../functions/hashImage";
import { collectUniqueMaterials } from "../functions/materials";

export async function getImageHash(hashCache, img) {
  let hash = hashCache.get(img.src);

  if (!hash) {
    hash = await hashImage(img);
    hashCache.set(img.src, hash);
  }

  return hash;
}

export async function compareImages(hashCache, a, b) {
  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return (await getImageHash(hashCache, a)) === (await getImageHash(hashCache, b));
}

export async function compareTextures(hashCache, a, b) {
  if (a && b) {
    return (
      a.wrapS === b.wrapS &&
      a.wrapT === b.wrapT &&
      a.magFilter === b.magFilter &&
      a.minFilter === b.minFilter &&
      (await compareImages(hashCache, a.image, b.image))
    );
  }

  return a === b;
}

async function meshBasicMaterialComparator(group, a, b) {
  const imageHashes = group.imageHashes;

  return (
    a.alphaTest === b.alphaTest &&
    a.blendDst === b.blendDst &&
    a.blendDstAlpha === b.blendDstAlpha &&
    a.blendEquation === b.blendEquation &&
    a.blendEquationAlpha === b.blendEquationAlpha &&
    a.blending === b.blending &&
    a.blendSrc === b.blendSrc &&
    a.blendSrcAlpha === b.blendSrcAlpha &&
    a.opacity === b.opacity &&
    a.side === b.side &&
    a.transparent === b.transparent &&
    a.color.equals(b.color) &&
    a.lightMapIntensity === b.lightMapIntensity &&
    (await compareTextures(imageHashes, a.map, b.map)) &&
    (await compareTextures(imageHashes, a.lightMap, b.lightMap))
  );
}

async function meshStandardMaterialComparator(group, a, b) {
  const imageHashes = group.imageHashes;

  return (
    a.roughness === b.roughness &&
    a.metalness === b.metalness &&
    a.aoMapIntensity === b.aoMapIntensity &&
    a.normalScale.equals(b.normalScale) &&
    a.emissive.equals(b.emissive) &&
    (await meshBasicMaterialComparator(group, a, b)) &&
    (await compareTextures(imageHashes, a.roughnessMap, b.roughnessMap)) &&
    (await compareTextures(imageHashes, a.metalnessMap, b.metalnessMap)) &&
    (await compareTextures(imageHashes, a.aoMap, b.aoMap)) &&
    (await compareTextures(imageHashes, a.normalMap, b.normalMap)) &&
    (await compareTextures(imageHashes, a.emissiveMap, b.emissiveMap))
  );
}

async function dedupeTexture(imageHashes, textureCache, texture) {
  if (!texture || !texture.image) return texture;

  const imageHash = await getImageHash(imageHashes, texture.image);

  const cachedTexture = textureCache.get(imageHash);

  if (cachedTexture) {
    return cachedTexture;
  }

  textureCache.set(imageHash, texture);

  return texture;
}

export default class MeshCombinationGroup {
  static MaterialComparators = {
    MeshStandardMaterial: meshStandardMaterialComparator,
    MeshBasicMaterial: meshBasicMaterialComparator
  };
  initialObject: any;
  meshes: any[];
  imageHashes: any;

  static async combineMeshes(rootObject) {
    rootObject.computeAndSetStaticModes();
    rootObject.computeAndSetVisible();

    const meshCombinationGroups = [];
    const imageHashes = new Map();
    const textureCache = new Map();

    const materials = collectUniqueMaterials(rootObject);

    for (const material of materials) {
      
      (material as any).map = await dedupeTexture(imageHashes, textureCache, (material as any).map);
      (material as any).roughnessMap = await dedupeTexture(imageHashes, textureCache, (material as any).roughnessMap);
      (material as any).metalnessMap = await dedupeTexture(imageHashes, textureCache, (material as any).metalnessMap);
      (material as any).aoMap = await dedupeTexture(imageHashes, textureCache, (material as any).aoMap);
      (material as any).normalMap = await dedupeTexture(imageHashes, textureCache, (material as any).normalMap);
      (material as any).emissiveMap = await dedupeTexture(imageHashes, textureCache, (material as any).emissiveMap);
      (material as any).lightMap = await dedupeTexture(imageHashes, textureCache, (material as any).lightMap);
    }

    await asyncTraverse(rootObject, async object => {
      if (isStatic(object) && object.isMesh) {
        let added = false;

        for (const group of meshCombinationGroups) {
          if (await group._tryAdd(object)) {
            added = true;
            break;
          }
        }

        if (!added) {
          meshCombinationGroups.push(new MeshCombinationGroup(object, imageHashes));
        }
      }
    });

    for (const group of meshCombinationGroups) {
      const combinedMesh = group._combine();

      if (combinedMesh) {
        rootObject.add(combinedMesh);
      }
    }

    return rootObject;
  }

  constructor(initialObject, imageHashes) {
    if (!initialObject.isMesh) {
      throw new Error("MeshCombinationGroup must be initialized with a Mesh.");
    }

    this.initialObject = initialObject;
    this.meshes = [initialObject];
    this.imageHashes = imageHashes;
  }

  async _tryAdd(object) {
    if (!object.isMesh || object.isSkinnedMesh) {
      return false;
    }

    if (!object.geometry.isBufferGeometry) {
      return false;
    }

    const compareMaterial = MeshCombinationGroup.MaterialComparators[object.material.type];

    if (
      object.visible !== this.initialObject.visible ||
      object.castShadow !== this.initialObject.castShadow ||
      object.receiveShadow !== this.initialObject.receiveShadow ||
      object.userData.gltfExtensions
    ) {
      return false;
    }

    if (!(compareMaterial && (await compareMaterial(this, this.initialObject.material, object.material)))) {
      return false;
    }

    if (!keysEqual(this.initialObject.geometry.attributes, object.geometry.attributes)) {
      return false;
    }

    this.meshes.push(object);

    return true;
  }

  _combine() {
    const originalMesh = this.meshes[0];

    if (this.meshes.length === 1) {
      return null;
    }

    const bufferGeometries = [];

    for (const mesh of this.meshes) {
      // Clone buffer geometry in case it is re-used across meshes with different materials.
      const clonedBufferGeometry = mesh.geometry.clone();

      const matrixWorld = mesh.matrixWorld;
      clonedBufferGeometry.applyMatrix(matrixWorld);

      // TODO: geometry.applyMatrix should handle this
      const hasNegativeScale = matrixWorld.elements[0] * matrixWorld.elements[5] * matrixWorld.elements[10] < 0;

      const indices = clonedBufferGeometry.index.array;

      if (hasNegativeScale && indices) {
        for (let i = 0; i < indices.length; i += 3) {
          const tmp = indices[i + 1];
          indices[i + 1] = indices[i + 2];
          indices[i + 2] = tmp;
        }
      }

      bufferGeometries.push(clonedBufferGeometry);
      mesh.parent.remove(mesh);
    }

    const combinedGeometry = mergeBufferGeometries(bufferGeometries);
    delete combinedGeometry.userData.mergedUserData;
    const combinedMesh = new Mesh(combinedGeometry, originalMesh.material);
    combinedMesh.name = "CombinedMesh";
    combinedMesh.userData.gltfExtensions = {
      componentData: {
        visible: {
          visible: originalMesh.visible
        },
        shadow: {
          cast: originalMesh.castShadow,
          receive: originalMesh.receiveShadow
        }
      }
    };

    return combinedMesh;
  }
}
