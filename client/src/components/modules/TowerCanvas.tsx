import React, { useRef, useEffect, useState } from "react";
import THREE from "./three/ThreeInstance";

import createTowerObj from "./three/createTowerObj";

import "../../utilities.css";

type Props = {
  towerProps: {
    radius: number;
    height: number;
    gradient: number;
    numPoints: number;
    phi: number;
    numSegments: number;
  };
  setTowerProps: React.Dispatch<
    React.SetStateAction<{
      radius: number;
      height: number;
      gradient: number;
      numPoints: number;
      phi: number;
      numSegments: number;
    }>
  >;
};

const TowerCanvas = (props: Props) => {
  const towerProps = props.towerProps;
  const setTowerProps = props.setTowerProps;
  // const [towerProps, setTowerProps] = useState({
  //   radius: 0.7,
  //   height: 5.4,
  //   gradient: 4,
  //   numPoints: 13,
  //   phi: (Math.PI * 5) / 6,
  //   numSegments: 14,
  // });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  // initialize the scene, camera, and renderer when component mounts
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const scene = sceneRef.current;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, -15, 0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    scene.background = new THREE.Color(0xffffff);

    return () => {
      renderer?.dispose();
    };
  }, []);

  // update the tower object when towerProps change
  useEffect(() => {
    const scene = sceneRef.current;
    const towerObj = createTowerObj(towerProps);

    scene.clear();
    scene.add(towerObj);

    // const animate = () => {
    //   requestAnimationFrame(animate);
    //   rendererRef.current!.render(scene, cameraRef.current!);
    // };

    // animate();
    rendererRef.current!.render(scene, cameraRef.current!);
  }, [towerProps]);

  return (
    <div className="u-flexColumn">
      <canvas ref={canvasRef} width={600} height={600} />
      <input
        type="range"
        onChange={(e) => setTowerProps({ ...towerProps, radius: parseFloat(e.target.value) })}
        min={0}
        max={2.8}
        step={0.1}
        defaultValue={towerProps.radius}
      />
      <input
        type="range"
        onChange={(e) => setTowerProps({ ...towerProps, gradient: parseFloat(e.target.value) })}
        min={1}
        max={8}
        step={0.2}
        defaultValue={towerProps.gradient}
      />
    </div>
  );
};

export default TowerCanvas;
