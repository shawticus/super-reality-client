import Command from "./Command";
import { TransformSpace } from "../constants/TransformSpace";
import arrayShallowEqual from "../functions/arrayShallowEqual";
import { serializeObject3DArray, serializeVector3 } from "../functions/debug";
export default class RotateOnAxisMultipleCommand extends Command {
  objects: any;
  axis: any;
  angle: any;
  space: any;
  oldRotations: any;
  constructor(editor, objects, axis, angle, space) {
    super(editor);
    this.objects = objects.slice(0);
    this.axis = axis.clone();
    this.angle = angle;
    this.space = space;
    this.oldRotations = objects.map(o => o.rotation.clone());
  }
  execute() {
    this.editor.rotateOnAxisMultiple(
      this.objects,
      this.axis,
      this.angle,
      this.space,
      false
    );
  }
  shouldUpdate(newCommand) {
    return (
      this.space === newCommand.space &&
      this.axis.equals(newCommand.axis) &&
      arrayShallowEqual(this.objects, newCommand.objects)
    );
  }
  update(command) {
    this.angle += command.angle;
    this.editor.rotateOnAxisMultiple(
      this.objects,
      this.axis,
      command.angle,
      this.space,
      false
    );
  }
  undo() {
    for (let i = 0; i < this.objects.length; i++) {
      this.editor.setRotation(
        this.objects[i],
        this.oldRotations[i],
        TransformSpace.Local,
        false,
        false
      );
    }
    this.editor.emit("objectsChanged", this.objects, "rotation");
  }
  toString() {
    return `RotateOnAxisMultipleCommand id: ${
      this.id
    } objects: ${serializeObject3DArray(this.objects)} axis: ${serializeVector3(
      this.axis
    )} angle: ${this.angle} space: ${this.space}`;
  }
}
