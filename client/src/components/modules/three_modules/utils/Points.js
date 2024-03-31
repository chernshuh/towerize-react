import * as THREE from "three";

/**
 * @param {Object} props
 * @param {number} props.radius
 * @param {number} props.height
 * @param {number} props.gradient
 * @param {number} props.numPoints
 * @param {number} props.phi
 * @param {number} props.numSegments // delete
 */

// All single points are represented as Vector3 objects.

const createSequences = (expression, start, end, step) => {
  const sequences = [];
  for (let i = start; i <= end; i += step) {
    sequences.push(expression(i));
  }
  return sequences;
};

const Points = (props) => {
  const centerPoints = createSequences(
    (i) => new THREE.Vector3(props.radius * Math.cos(i), props.radius * Math.sin(i), 0),
    0,
    Math.PI * 2,
    (Math.PI * 2) / props.numPoints
  );

  const centerPointsWhirled = createSequences(
    (i) =>
      new THREE.Vector3(
        props.radius * Math.cos(i + props.phi),
        props.radius * Math.sin(i + props.phi),
        0
      ),
    0,
    Math.PI * 2,
    (Math.PI * 2) / props.numPoints
  );

  const directionPoints = createSequences(
    (i) =>
      new THREE.Vector3(
        (-props.height / props.gradient) * Math.sin(i),
        (props.height / props.gradient) * Math.cos(i),
        props.height
      ),
    0,
    Math.PI * 2,
    (Math.PI * 2) / props.numPoints
  );

  const directionPointsWhirled = createSequences(
    (i) =>
      new THREE.Vector3(
        (-props.height / props.gradient) * Math.sin(i + props.phi),
        (props.height / props.gradient) * Math.cos(i + props.phi),
        props.height
      ),
    0,
    Math.PI * 2,
    (Math.PI * 2) / props.numPoints
  );

  const bottomPoints = createSequences(
    (i) => {
      const vector3 = centerPoints[i].clone();
      vector3.addScaledVector(directionPoints[i], -8 / 5);
      return vector3;
    },
    1,
    props.numPoints,
    1
  );

  const bottomPointsWhirled = createSequences(
    (i) => {
      const vector3 = centerPointsWhirled[i].clone();
      vector3.addScaledVector(directionPointsWhirled[i], -8 / 5);
      return vector3;
    },
    1,
    props.numPoints,
    1
  );

  const topPoints = createSequences(
    (i) => new THREE.Vector3().addVectors(centerPoints[i], directionPoints[i]),
    1,
    props.numPoints,
    1
  );

  const topPointsWhirled = createSequences(
    (i) => new THREE.Vector3().addVectors(centerPointsWhirled[i], directionPointsWhirled[i]),
    1,
    props.numPoints,
    1
  );

  const verticalPoints = createSequences(
    (i) => new THREE.Vector3(0, 0, -i * props.height),
    -1,
    8 / 5,
    1 / 5
  );

  const tiltedPoints = createSequences(
    (i) => {
      const vector3 = centerPoints[0].clone();
      vector3.addScaledVector(directionPoints[0], -i);
      return vector3;
    },
    -1,
    8 / 5,
    1 / 5
  );

  return {
    centerPoints: centerPoints,
    centerPointsWhirled: centerPointsWhirled,
    directionPoints: directionPoints,
    directionPointsWhirled: directionPointsWhirled,
    topPoints: topPoints,
    topPointsWhirled: topPointsWhirled,
    bottomPoints: bottomPoints,
    bottomPointsWhirled: bottomPointsWhirled,
    verticalPoints: verticalPoints,
    tiltedPoints: tiltedPoints,
  };
};

export default Points;
