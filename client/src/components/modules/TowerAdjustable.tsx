import React, { useRef, useEffect, useState } from "react";
import THREE from "./three/ThreeInstance";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import createTowerObj from "./three/createTowerObj";

import "./TowerAdjustable.css";

type Props = {
  tower: {
    radius: number;
    gradient: number;
  };
  canvas: {
    width: number;
    height: number;
  };
  // setTower: React.Dispatch<
  //   React.SetStateAction<{
  //     radius: number;
  //     gradient: number;
  //   }>
  // >;
};

const TowerAdjustable = (props: Props) => {
  const tower = props.tower;
  // const setTower = props.setTower;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animateIdRef = useRef<number>();

  // useRef to keep track of the scene, camera, renderer, and controls
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();

  const defaultCameraPosition = new THREE.Vector3(0, -15, 0);

  const handleBack = () => {
    cameraRef.current?.position.copy(defaultCameraPosition);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.copy(defaultCameraPosition);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, canvas);
    controlsRef.current = controls;

    return () => {
      renderer?.dispose();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const towerObj = createTowerObj({ ...tower, plainStyle: false });

    scene.clear();
    scene.add(towerObj);

    const animate = () => {
      animateIdRef.current = requestAnimationFrame(animate);
      controlsRef.current!.update();
      rendererRef.current!.render(scene, cameraRef.current!);
    };

    animate();

    return () => {
      cancelAnimationFrame(animateIdRef.current!);
      rendererRef.current?.dispose();
    };
  }, [tower]);

  return (
    <>
      <canvas
        className="TowerAdjustable-canvas"
        ref={canvasRef}
        width={props.canvas.width}
        height={props.canvas.height}
      />
      <div className="u-button-black u-useFlame" onClick={handleBack}>
        DEFAULT VIEW
      </div>
    </>
  );
};

export default TowerAdjustable;
