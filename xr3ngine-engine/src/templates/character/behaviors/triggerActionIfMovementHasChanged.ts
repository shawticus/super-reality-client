import { Behavior } from "xr3ngine-engine/src/common/interfaces/Behavior";
import { Entity } from "../../../ecs/classes/Entity";
import { getMutableComponent } from "../../../ecs/functions/EntityFunctions";
import { Input } from "../../../input/components/Input";
import { CharacterComponent } from "../components/CharacterComponent";
import { BinaryValue } from "xr3ngine-engine/src/common/enums/BinaryValue";
import { BaseInput } from 'xr3ngine-engine/src/input/enums/BaseInput';


export const triggerActionIfMovementHasChanged: Behavior = (entity: Entity, args: { action: any }): void => {
	const character: CharacterComponent = getMutableComponent(entity, CharacterComponent);
	if (!character.initialized) return;
	const input: Input = getMutableComponent<Input>(entity, Input as any);

	const hash = Array.from(input.data.keys()).reduce((accumulator, key) => {
		return accumulator.toString().concat(key.toString());
	}, 0) + 'LDM' + character.localMovementDirection.toArray().map(n => n.toFixed(7)).join(':');

	if (character.currentInputHash !== hash) {
	//	args.action(entity);
/*
		if (input.data.has(BaseInput.JUMP) && input.data.get(BaseInput.JUMP).value === BinaryValue.ON) {
	   // physicsJump(entity);
	  }
*/

		character.currentInputHash = hash;
	}
};
