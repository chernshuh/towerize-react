import React, { useRef, useEffect, useState } from "react";

import * as THREE from "three";
import Tower from "./three_modules/Tower";

type Props = {
  canvas: { height: number; width: number };
  tower: {
    radius: number;
    height: number;
    gradient: number;
    numPoints: number;
    phi: number;
    numSegments: number;
  };
};

const TowerCanvas = (props: Props) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tower = new Tower(props.tower);
    tower.createTower();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
      75,
      props.canvas.width / props.canvas.height,
      0.1,
      1000
    );
    camera.position.set(0, -15, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(props.canvas.width, props.canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene.add(tower.body);

    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    renderScene();

    return () => {
      // TODO: implement cleanup
      if (canvasRef.current && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      THREE.BufferGeometry.prototype.dispose();
      THREE.Material.prototype.dispose();
      tower.body.clear();
      scene.clear();
      renderer.dispose();
    };
  }, [props]);

  return <div ref={canvasRef} />;
};

export default TowerCanvas;
