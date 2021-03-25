import { Box3 } from "three";
import { Component } from "../../ecs/classes/Component";
import { Types } from "../../ecs/types/Types";

export class BoundingBox extends Component<BoundingBox> {
  public box: Box3;
  public boxArray: any[];
  public dynamic: boolean;

  static _schema = {
    box: { type:  Types.Ref, default: new Box3() },
    boxArray: { type: Types.Array, default: [] },
    dynamic: { type: Types.Boolean, default: false },
  }
}
