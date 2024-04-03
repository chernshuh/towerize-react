import THREE from "../ThreeInstance";
/**
 * @param {Object} props
 * @param {Object} props.geometry
 * @param {Object} props.style
 * @param {THREE.Vector3} props.geometry.sphereCenter
 * @param {float} props.style.sphereRadius
 * @param {THREE.Color} props.style.color
 */

const Sphere = (props) => {
  const geometry = props.geometry;
  const style = props.style;

  const sphereMaterial = new THREE.MeshBasicMaterial({ color: style.color });
  const sphereGeometry = new THREE.SphereGeometry(style.sphereRadius);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(geometry.sphereCenter);

  return sphere;
};

export default Sphere;
