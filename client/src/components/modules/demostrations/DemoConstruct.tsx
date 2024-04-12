import React, { useState } from "react";
import Draggable from "react-draggable";

import TowerAdjustable from "../TowerAdjustable";
import "./DemoConstruct.css";

type Props = {};

const DemoConstruct = (props: Props) => {
  const [radius, setRadius] = useState(0.7);
  const [gradient, setGradient] = useState(4);

  // const [position, setPosition] = useState({ x: 0, y: 0 });

  const trackPos = (e, data) => {
    console.log(data.x);
  };

  return (
    <div className="DemoConstruct-container u-flexColumn">
      <div className="DemoConstruct-tower">
        <TowerAdjustable
          tower={{ radius, gradient }}
          canvas={{ width: 300, height: 300 }}
          plainStyle={true}
        />
      </div>
      <div className="DemoConstruct-move-container">
        <div className="DemoConstruct-move-left-boound">
          <Draggable onDrag={trackPos} bounds="parent" axis="x">
            <div className="DemoConstruct-move-left"></div>
          </Draggable>
        </div>
        <div className="DemoConstruct-move-right"></div>
      </div>
      <div className="DemoConstruct-gradient"></div>
    </div>
  );
};

export default DemoConstruct;
