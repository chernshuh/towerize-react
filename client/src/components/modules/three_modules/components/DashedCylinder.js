import * as THREE from "three";

import Cylinder from "./Cylinder";

/**
 * @param {Object} props
 * @param {Object} props.geometry
 * @param {Object} props.style
 * @param {THREE.Vector3} props.geometry.startPoint
 * @param {THREE.Vector3} props.geometry.endPoint
 * @param {THREE.Color} props.style.color
 * @param {float} props.style.width
 * @param {float} props.style.dashSize
 * @param {float} props.style.gapSize
 */

const DashedCylinder = (props) => {
  const geometry = props.geometry;
  const style = props.style;

  const dashedCylinder = new THREE.Group();

  const direction = new THREE.Vector3().subVectors(geometry.endPoint, geometry.startPoint);

  const numCylinders = Math.floor(direction.length() / (style.dashSize + style.gapSize));

  const addCylinder = (startPoint, endPoint) => {
    const cylinder = Cylinder({
      geometry: { startPoint: startPoint, endPoint: endPoint },
      style: { color: style.color, width: style.width },
    });

    dashedCylinder.add(cylinder);
  };

  const startPoints = [];
  const endPoints = [];

  const startPointWithDash = geometry.startPoint
    .clone()
    .addScaledVector(direction, style.dashSize / direction.length());

  for (let i = 0; i < numCylinders + 1; i++) {
    startPoints.push(
      geometry.startPoint
        .clone()
        .addScaledVector(direction, (i * (style.dashSize + style.gapSize)) / direction.length())
    );
    endPoints.push(
      startPointWithDash
        .clone()
        .addScaledVector(
          direction,
          ((i * (style.dashSize + style.gapSize)) % direction.length()) / direction.length()
        )
    );
  }

  startPoints.forEach((startPoint, index) => {
    addCylinder(startPoint, endPoints[index]);
  });

  return dashedCylinder;
};

export default DashedCylinder;
