import { Body, RaycastVehicle, Sphere, Vec3  } from "cannon-es";
import { Euler, Quaternion } from 'three';
import { cannonFromThreeVector } from "../../common/functions/cannonFromThreeVector";
import { isClient } from "../../common/functions/isClient";
import { isServer } from "../../common/functions/isServer";
import { Behavior } from '../../common/interfaces/Behavior';
import { Entity } from '../../ecs/classes/Entity';
import { getComponent, getMutableComponent, hasComponent } from '../../ecs/functions/EntityFunctions';
import { Network } from '../../networking/classes/Network';
import { NetworkObject } from '../../networking/components/NetworkObject';
import { VehicleBody } from '../../physics/components/VehicleBody';
import { TransformComponent } from '../../transform/components/TransformComponent';
import { CollisionGroups } from "../enums/CollisionGroups";
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { createTrimesh } from "./physicalPrimitives";
import { LocalInputReceiver } from '../../input/components/LocalInputReceiver';


function createVehicleBody (entity: Entity ) {
  const vehicleComponent = getMutableComponent<VehicleBody>(entity, VehicleBody);
  // @ts-ignore
  const colliderTrimOffset = new Vec3().set(...vehicleComponent.colliderTrimOffset);
  // @ts-ignore
  const collidersSphereOffset = new Vec3().set(...vehicleComponent.collidersSphereOffset);
  const wheelsPositions = vehicleComponent.arrayWheelsPosition;
  const wheelRadius = vehicleComponent.wheelRadius;
  const vehicleCollider = vehicleComponent.vehicleCollider;
  const vehicleSphereColliders = vehicleComponent.vehicleSphereColliders;
  const mass = vehicleComponent.mass;

  let chassisBody, chassisShape;

  if (vehicleCollider) {
    chassisBody = createTrimesh(vehicleCollider, new Vec3(), mass);
    /*
    chassisBody.shapes.forEach((shape) => {
      shape.collisionFilterMask = ~CollisionGroups.Car;
    });
    */
  } else {
    //chassisShape = new Box(new Vec3(1, 0.2, 2.0));
    chassisBody = new Body({ mass });
  //  chassisBody.addShape(chassisShape);
  }


  for (let i = 0; i < vehicleSphereColliders.length; i++) {
    const shape = new Sphere(vehicleSphereColliders[i].scale.x);
  //  shape.collisionFilterGroup = ~CollisionGroups.Car;
  //  shape.collisionFilterMask = ~CollisionGroups.Default;
    chassisBody.addShape(shape, cannonFromThreeVector(vehicleSphereColliders[i].position).vadd(collidersSphereOffset));
  }

  chassisBody.collisionFilterGroup = CollisionGroups.Car;
  chassisBody.position.set( ...vehicleComponent.startPosition );
  //chassisBody.angularVelocity.set(0, 0, 0.5);

  const options = {
    radius: wheelRadius,
    directionLocal: new Vec3(0, -1, 0),
    suspensionStiffness: 30,
    suspensionRestLength: vehicleComponent.suspensionRestLength,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 1.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new Vec3(-1, 0, 0),
    chassisConnectionPointLocal: new Vec3(),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true
  };

  // Create the vehicle
  const vehicle = new RaycastVehicle({
    chassisBody: chassisBody,
    indexUpAxis: 1,
    indexRightAxis: 0,
    indexForwardAxis: 2
  });

//
  options.chassisConnectionPointLocal.set(wheelsPositions[0].x, wheelsPositions[0].y, wheelsPositions[0].z);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(wheelsPositions[1].x, wheelsPositions[1].y, wheelsPositions[1].z);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(wheelsPositions[2].x, wheelsPositions[2].y, wheelsPositions[2].z);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(wheelsPositions[3].x, wheelsPositions[3].y, wheelsPositions[3].z);
  vehicle.addWheel(options);
/*
  const wheelBodies = [];
  for (let i = 0; i < vehicle.wheelInfos.length; i++) {
    const cylinderShape = new Cylinder(wheelRadius, wheelRadius, 0.1, 20);
    const wheelBody = new Body({
      mass: 0
    });
    wheelBody.type = Body.KINEMATIC;
    wheelBody.collisionFilterGroup = 0; // turn off collisions
    wheelBody.addShape(cylinderShape);
    wheelBodies.push(wheelBody);

  }
*/
  vehicle.addToWorld(PhysicsSystem.physicsWorld);

/*
  for (let i = 0; i < wheelBodies.length; i++) {
    PhysicsSystem.physicsWorld.addBody(wheelBodies[i]);
  }
  */
  return vehicle;
}

export const VehicleBehavior: Behavior = (entity: Entity, args): void => {
  if (args.phase == 'onAdded') {
    const vehicleComponent = getMutableComponent(entity, VehicleBody);
    const vehicle = createVehicleBody(entity);
    vehicleComponent.vehiclePhysics = vehicle;
  } else if ( args.phase == 'onUpdate') {

    const transform = getMutableComponent<TransformComponent>(entity, TransformComponent);
    const vehicleComponent = getComponent(entity, VehicleBody) as VehicleBody;

    if( vehicleComponent.vehiclePhysics != null ) {

      const vehicle = vehicleComponent.vehiclePhysics;
      const isMoved = vehicleComponent.isMoved;
      const chassisBody = vehicle.chassisBody;
      const wheels = vehicleComponent.arrayWheelsMesh;
      const carSpeed = vehicle.currentVehicleSpeedKmHour;

      if(isServer) {
        // STOP FORCE
        if (!isMoved && (carSpeed > 1 || carSpeed < -1) ) {
          vehicle.applyEngineForce(carSpeed * 2, 2);
          vehicle.applyEngineForce(carSpeed * 2, 3);
        } else if (!isMoved && (carSpeed < 0.1 && carSpeed > -0.1)) {
          vehicle.setBrake(0.3, 0);
          vehicle.setBrake(0.3, 1);
          vehicle.applyEngineForce(-1, 2);
          vehicle.applyEngineForce(-1, 3);
        } else if (!isMoved && (carSpeed < 1 && carSpeed > -1)) {
          vehicle.setBrake(2, 0);
          vehicle.setBrake(2, 1);
          vehicle.applyEngineForce(-3, 2);
          vehicle.applyEngineForce(-3, 3);
        }
      }

      // APPLY PHYSICS TO TRANSFORM
      transform.position.set(
        chassisBody.position.x,
        chassisBody.position.y,
        chassisBody.position.z
      );
      transform.rotation.set(
        chassisBody.quaternion.x,
        chassisBody.quaternion.y,
        chassisBody.quaternion.z,
        chassisBody.quaternion.w
      );
      if(isServer) {
        for (let i = 0; i < wheels.length; i++) {
          vehicle.updateWheelTransform(i);
        }
      }

    } else {
      console.warn("User data for vehicle not found");
    }

  } else if (args.phase == 'onRemoved') {
    // TO DO
    /*
    const object = getComponent<Object3DComponent>(entity, Object3DComponent, true)?.value;
    if (!object) {
      return
    }
    const body = object.userData.vehicle;
    delete object.userData.vehicle;
    PhysicsSystem.physicsWorld.removeBody(body);
    */
  }
};
