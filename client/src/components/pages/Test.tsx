import React, { useState } from "react";

import TowerCanvas from "../modules/TowerCanvas";
import HandDetection from "../modules/HandDetection";

import Slider from "../modules/Slider";

type Props = {};

const Test = (props: Props) => {
  type TowerProps = {
    radius: number;
    height: number;
    gradient: number;
    numPoints: number;
    phi: number;
    numSegments: number;
  };

  const [towerProps, setTowerProps] = useState<TowerProps>({
    radius: 0.7,
    height: 5.4,
    gradient: 4,
    numPoints: 13,
    phi: (Math.PI * 5) / 6,
    numSegments: 14,
  });

  const testProps: { [key: string]: number } = { redius: 0.7 };

  return (
    <div>
      <h1>Test</h1>
      <div className="u-flex">
        <div>
          <TowerCanvas canvas={{ height: 500, width: 500 }} tower={towerProps} />
          <Slider
            startValue={0}
            endValue={10.8}
            defaultValue={towerProps.height}
            step={0.1}
            onChange={(newValue) =>
              setTowerProps((prevProps) => ({ ...prevProps, height: newValue }))
            }
          />
        </div>
        <div>
          <HandDetection />
        </div>
      </div>
    </div>
  );
};

export default Test;
