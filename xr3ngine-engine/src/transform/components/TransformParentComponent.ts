import { Component } from '../../ecs/classes/Component';
import { Types } from '../../ecs/types/Types';

export class TransformParentComponent extends Component<TransformParentComponent> {
  children: any[] = []
}
TransformParentComponent._schema = {
  children: { default: [], type: Types.Array }
};
