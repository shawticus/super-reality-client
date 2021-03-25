import Command from "./Command";
import { serializeObject3D } from "../functions/debug";
export default class LoadMaterialSlotCommand extends Command {
  object: any;
  subPieceId: any;
  materialSlotId: any;
  materialId: any;
  prevMaterialId: any;
  constructor(editor, object, subPieceId, materialSlotId, materialId) {
    super(editor);
    this.object = object;
    this.subPieceId = subPieceId;
    this.materialSlotId = materialSlotId;
    this.materialId = materialId;
    this.prevMaterialId = object.getMaterialIdForMaterialSlot(
      subPieceId,
      materialSlotId
    );
  }
  execute() {
    this.editor.loadMaterialSlot(
      this.object,
      this.subPieceId,
      this.materialSlotId,
      this.materialId,
      false
    );
  }
  undo() {
    this.editor.loadMaterialSlot(
      this.object,
      this.subPieceId,
      this.materialSlotId,
      this.prevMaterialId,
      false
    );
  }
  toString() {
    return `LoadMaterialSlotCommand id: ${this.id} object: ${serializeObject3D(
      this.object
    )} subPieceId: ${this.subPieceId} materialSlotId: ${
      this.materialSlotId
    } materialId: ${this.materialId}`;
  }
}
