import React from "react";

import SingleTower from "../modules/SingleTower";

import "./TowerCard.css";

type Props = {
  tower: {
    radius: number;
    gradient: number;
  };
  date: string;
  isFocused: boolean;
};

const TowerCard = (props: Props) => {
  return (
    <div
      className={
        props.isFocused
          ? "TowerCard-container-focus u-flexColumn"
          : "TowerCard-container u-flexColumn"
      }
    >
      <div className="TowerCard-date">{props.date}</div>
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
