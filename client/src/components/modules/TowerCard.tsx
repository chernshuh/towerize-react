import React, { useState } from "react";

import SingleTower from "./SingleTower";

import "./TowerCard.css";

type Props = {
  tower: {
    radius: number;
    gradient: number;
  };
  date: Date;
};

const TowerCard = (props: Props) => {
  const createTime = new Date(props.date);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={
        isFocused ? "TowerCard-container-focus u-flexColumn" : "TowerCard-container u-flexColumn"
      }
      onClick={() => setIsFocused(!isFocused)}
    >
      <div className="TowerCard-date">{createTime.toLocaleString()}</div>
      <SingleTower
        tower={props.tower}
        canvas={{ width: 388, height: 384 }}
        plainStyle={false}
        rotating={false}
      />
    </div>
  );
};

export default TowerCard;
