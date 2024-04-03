import THREE from './ThreeInstance';

import Sphere from "./components/Sphere";
import Circle from "./components/Circle";
import Cylinder from "./components/Cylinder";

import Points from "./utils/Points";

type Props = {
  radius: number;
  height: number;
  gradient: number;
  numPoints: number;
  phi: number;
  numSegments: number;
}

const createTowerObj = (props: Props) => {
  const towerObj = new THREE.Group()

  const points = Points(props);

  const lines = points.bottomPoints.map((point, index) =>
    Cylinder({
      geometry: { startPoint: point, endPoint: points.topPoints[index] },
      style: { color: new THREE.Color(0xff6600), width: 0.02 },
    })
  );

  const whirledLines = points.topPointsWhirled.map((point, index) =>
    Cylinder({
      geometry: { startPoint: point, endPoint: points.bottomPointsWhirled[index] },
      style: { color: new THREE.Color(0xffff66), width: 0.02 },
    })
  );

  const circles = points.verticalPoints.map((point, index) =>
    Circle({
      geometry: {
        circleCenter: point,
        circleLookAt: new THREE.Vector3(0, 0, 1),
        circleRadius: point.distanceTo(points.tiltedPoints[index]),
      },
      style: { dashedScale: 0.5, width: 0.03, color: new THREE.Color(0xff0033) },
    })
  );

  circles[0] = Circle({
    geometry: {
      circleCenter: points.verticalPoints[0],
      circleLookAt: new THREE.Vector3(0, 0, 1),
      circleRadius: points.verticalPoints[0].distanceTo(points.tiltedPoints[0]),
    },
    style: { dashedScale: 0, width: 0.03, color: new THREE.Color(0xff0033) },
  });

  circles[circles.length - 1] = Circle({
    geometry: {
      circleCenter: points.verticalPoints[circles.length - 1],
      circleLookAt: new THREE.Vector3(0, 0, 1),
      circleRadius: points.verticalPoints[circles.length - 1].distanceTo(
        points.tiltedPoints[circles.length - 1]
      ),
    },
    style: { dashedScale: 0, width: 0.03, color: new THREE.Color(0xff0033) },
  });

  const topSpheres = points.topPoints.map((point) =>
    Sphere({
      geometry: { sphereCenter: point },
      style: { sphereRadius: 0.1, color: new THREE.Color(0xcc0000) },
    })
  );

  const bottomSpheres = points.bottomPoints.map((point) =>
  Sphere({
    geometry: { sphereCenter: point },
    style: { sphereRadius: 0.1, color: new THREE.Color(0xcc0000) },
  })
);

  const antenna = new THREE.Group();

  antenna.add(
    Sphere({
      geometry: {
        sphereCenter: points.verticalPoints[0]
          .clone()
          .add(new THREE.Vector3(0, 0, (3 / 5) * props.height)),
      },
      style: { sphereRadius: 0.1, color: new THREE.Color(0xff7f00) },
    })
  );

  antenna.add(
    Cylinder({
      geometry: {
        startPoint: points.verticalPoints[0],
        endPoint: points.verticalPoints[0]
          .clone()
          .add(new THREE.Vector3(0, 0, (3 / 5) * props.height)),
      },
      style: { color: new THREE.Color(0xff7f00), width: 0.05 },
    })
  );

  towerObj.add(...lines);
  towerObj.add(...whirledLines);
  towerObj.add(...circles);
  towerObj.add(...topSpheres);
  towerObj.add(...bottomSpheres);
  towerObj.add(antenna);

  return towerObj
}

export default createTowerObj