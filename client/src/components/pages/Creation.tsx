import React from "react";

import SingleTower from "../modules/SingleTower";
import "./Creation.css";

type Props = {};

const Creation = (props: Props) => {
  return (
    <div className="u-flex">
      <div className="Creation-cameraContainer u-flexColumn  noto-sans">
        <div className="Creation-videoContainer"></div>
        <div className="Creation-optionsContainer">
          <div className="Creation-controls">
            <h3 className="Creation-title">Controls</h3>
            <hr className="Creation-line" />
            <div className="Creation-button">
              <p style={{ padding: 24 }}>Open Camera</p>
            </div>
            <div className="Creation-button">
              <p style={{ padding: 24 }}>Start Prediction</p>
            </div>
          </div>
          <div className="Creation-properties">
            <h3 className="Creation-title">Properties</h3>
            <hr className="Creation-line" />
          </div>
        </div>
      </div>
      <div className="Creation-canvasContainer u-flexColumn">
        {/* <div className="Creation-canvas u-flex"> */}
        <SingleTower
          tower={{ radius: 0.7, gradient: 4 }}
          canvas={{ width: 700, height: 700 }}
          rotating={false}
          plainStyle={false}
        />
        {/* </div> */}
      </div>
      <div className="Creation-buttonContainer">
        <div className="Creation-button">
          <p style={{ padding: 24 }}>Save</p>
        </div>
      </div>
    </div>
  );
};

export default Creation;
