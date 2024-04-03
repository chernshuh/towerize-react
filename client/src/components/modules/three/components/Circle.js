import THREE from "../ThreeInstance";

import Cylinder from "./Cylinder";

/**
 * @param {Object} props
 * @param {Object} props.geometry
 * @param {Object} props.style
 * @param {THREE.Vector3} props.geometry.circleCenter
 * @param {THREE.Vector3} props.geometry.circleLookAt // TODO: Need to implement
 * @param {float} props.geometry.circleRadius
 * @param {float} props.style.dashedScale
 * @param {float} props.style.width
 * @param {THREE.Color} props.style.color
 */

const Circle = (props) => {
  const geometry = props.geometry;
  const style = props.style;

  const numSegments = 32;

  const points = [];
  for (let i = 0; i < numSegments + 1; i++) {
    const theta = (i / numSegments) * Math.PI * 2;
    const vector3 = new THREE.Vector3();
    vector3.set(
      geometry.circleRadius * Math.cos(theta),
      geometry.circleRadius * Math.sin(theta),
      0
    );
    vector3.add(geometry.circleCenter);
    points.push(vector3);
  }

  const circle = new THREE.Group();

  if (style.dashedScale) {
    const whirledPoints = [];
    for (let i = 0; i < numSegments + 1; i++) {
      const theta = (i / numSegments + style.dashedScale / numSegments) * Math.PI * 2;
      const vector3 = new THREE.Vector3();
      vector3.set(
        geometry.circleRadius * Math.cos(theta),
        geometry.circleRadius * Math.sin(theta),
        0
      );
      vector3.add(geometry.circleCenter);
      whirledPoints.push(vector3);
    }

    points.forEach((point, index) => {
      const cylinder = Cylinder({
        geometry: { startPoint: point, endPoint: whirledPoints[index] },
        style: { color: style.color, width: style.width },
      });

      circle.add(cylinder);
    });
  } else {
    points.forEach((point, index) => {
      const cylinder = Cylinder({
        geometry: { startPoint: point, endPoint: points[(index + 1) % points.length] },
        style: { color: style.color, width: style.width },
      });

      circle.add(cylinder);
    });
  }

  return circle;
};

export default Circle;
