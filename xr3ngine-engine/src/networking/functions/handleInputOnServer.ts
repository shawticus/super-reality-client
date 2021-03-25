import { BinaryValue } from '../../common/enums/BinaryValue';
import { LifecycleValue } from '../../common/enums/LifecycleValue';
import { Behavior } from '../../common/interfaces/Behavior';
import { NumericalType } from '../../common/types/NumericalTypes';
import { Entity } from '../../ecs/classes/Entity';
import { getMutableComponent } from '../../ecs/functions/EntityFunctions';
import { Input } from '../../input/components/Input';
import { InputType } from '../../input/enums/InputType';
import { InputValue } from '../../input/interfaces/InputValue';
import { InputAlias } from '../../input/types/InputAlias';

/**
 * Call all behaviors associated with current input in it's current lifecycle phase
 * i.e. if the player has pressed some buttons that have added the value to the input queue,
 * call behaviors (move, jump, drive, etc) associated with that input.\
 * There are two cycles:
 * - Call behaviors according to value.lifecycleState.
 * - Clean processed LifecycleValue.ENDED inputs.
 *
 * @param entity The entity
 * @param args
 * @param delta Time since last frame
 */
export const handleInputFromNonLocalClients: Behavior = (entity: Entity, args: { isLocal: boolean, isServer: boolean }, delta: number): void => {

  // Get immutable reference to Input and check if the button is defined -- ignore undefined buttons
  const input = getMutableComponent(entity, Input);

  // For each input currently on the input object:
  input.data.forEach((value: InputValue<NumericalType>, key: InputAlias) => {

    // If the input is a button
    if (value.type === InputType.BUTTON) {

      // If the input exists on the input map (otherwise ignore it)
      if (input.schema.inputButtonBehaviors[key]) {

        // If the button is pressed
        if (value.value === BinaryValue.ON) {
          // ... and the button was just started
          if (value.lifecycleState === LifecycleValue.STARTED) {
            // Set the value of the input to continued to debounce
            input.schema.inputButtonBehaviors[key].started?.forEach(element => {
              element.behavior(entity, element.args, delta)
            }
            );
          } else if (value.lifecycleState === LifecycleValue.CONTINUED) {
            // ... otherwise, if the button was continued from last frame
            input.schema.inputButtonBehaviors[key].continued?.forEach(element =>
              element.behavior(entity, element.args, delta)
            );
          }
          // Otherwise the button was probably ende
        } else {
          input.schema.inputButtonBehaviors[key].ended?.forEach(element =>
            element.behavior(entity, element.args, delta)
          );
        }
      }
    }
    // If the input is an axis
    else if (input.schema.inputAxisBehaviors[key]) {
        // Handle based on lifecycle state
        switch (value.lifecycleState) {
          case LifecycleValue.STARTED:
            // Set the value to continued to debounce
            input.schema.inputAxisBehaviors[key].started?.forEach(element =>
              element.behavior(entity, element.args, delta)
            );
            break;
          case LifecycleValue.CHANGED:
            // If the value is different from last frame, update it
            input.schema.inputAxisBehaviors[key].changed?.forEach(element => {
              element.behavior(entity, element.args, delta);
            });
            break;
          case LifecycleValue.UNCHANGED:
            input.schema.inputAxisBehaviors[key].unchanged?.forEach(element =>
              element.behavior(entity, element.args, delta)
            );
            break;
          case LifecycleValue.ENDED:
            console.warn("Patch fix, need to handle properly: ", LifecycleValue.ENDED);
            break;
          default:
            console.error('Unexpected lifecycleState', value.lifecycleState, LifecycleValue[value.lifecycleState]);
        }
      }
  });
};
