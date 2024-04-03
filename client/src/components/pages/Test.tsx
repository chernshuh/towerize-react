import React, { useState } from "react";

import TowerCanvas from "../modules/TowerCanvas";
import CamCanvas from "../modules/CamCanvas";

type Props = {};

const Test = (props: Props) => {
  const [towerProps, setTowerProps] = useState({
    radius: 0.7,
    height: 5.4,
    gradient: 4,
    numPoints: 13,
    phi: (Math.PI * 5) / 6,
    numSegments: 14,
  });
  return (
    <div className="u-flex">
      <TowerCanvas towerProps={towerProps} setTowerProps={setTowerProps} />
      <CamCanvas towerProps={towerProps} setTowerProps={setTowerProps} />
    </div>
  );
};

export default Test;
