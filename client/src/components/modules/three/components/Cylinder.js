import THREE from "../ThreeInstance";
/**
 * @param {Object} props
 * @param {Object} props.geometry
 * @param {Object} props.style
 * @param {THREE.Vector3} props.geometry.startPoint
 * @param {THREE.Vector3} props.geometry.endPoint
 * @param {THREE.Color} props.style.color
 * @param {float} props.style.width
 */

const Cylinder = (props) => {
  const geometry = props.geometry;
  const style = props.style;

  const redialSegments = 32;

  const direction = new THREE.Vector3().subVectors(geometry.endPoint, geometry.startPoint);

  const cylinderGeometry = new THREE.CylinderGeometry(
    style.width,
    style.width,
    direction.length(),
    redialSegments
  );

  const cylinderMaterial = new THREE.MeshBasicMaterial({ color: style.color });

  cylinderGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, direction.length() / 2, 0));
  cylinderGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(90)));

  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

  cylinder.position.copy(geometry.startPoint);
  cylinder.lookAt(geometry.endPoint);

  return cylinder;
};

export default Cylinder;
