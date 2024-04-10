import React, { useEffect, useRef } from "react";
import THREE from "./three/ThreeInstance";

import createTowerObj from "./three/createTowerObj";

type Props = {
  tower: {
    radius: number;
    gradient: number;
  };
  canvas: {
    width: number;
    height: number;
  };
  plainStyle: boolean;
  rotating: boolean;
};

const SingleTower = (props: Props) => {
  const towerProps = props.tower;
  const canvasProps = props.canvas;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  const animateIdRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current!;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    // scene.background = new THREE.Color(0xffffff);

    camera.position.set(0, -15, 0);
    camera.lookAt(0, 0, 0);

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const towerObj = createTowerObj({ ...towerProps, plainStyle: props.plainStyle });
    scene.add(towerObj);

    const animate = () => {
      if (props.rotating) {
        animateIdRef.current = requestAnimationFrame(animate);
        towerObj.rotation.z += 0.01;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animateIdRef.current) cancelAnimationFrame(animateIdRef.current);
      renderer?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} width={canvasProps.width} height={canvasProps.height} />;
};

export default SingleTower;
