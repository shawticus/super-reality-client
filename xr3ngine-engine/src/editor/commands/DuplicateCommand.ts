import Command from "./Command";
import { serializeObject3D } from "../functions/debug";
export default class DuplicateCommand extends Command {
  object: any;
  parent: any;
  before: any;
  oldSelection: any;
  duplicatedObject: any;
  constructor(editor, object, parent, before) {
    super(editor);
    this.object = object;
    this.parent = parent;
    this.before = before;
    this.oldSelection = editor.selected.slice(0);
    this.duplicatedObject = null;
  }
  execute() {
    this.duplicatedObject = this.editor.duplicate(
      this.object,
      this.parent,
      this.before,
      false
    );
  }
  undo() {
    this.editor.removeObject(this.duplicatedObject, false, true, false);
    this.editor.setSelection(this.oldSelection, false);
  }
  toString() {
    return `DuplicateCommand id: ${this.id} object: ${serializeObject3D(
      this.object
    )} parent: ${serializeObject3D(this.parent)} before: ${serializeObject3D(
      this.before
    )}`;
  }
}
