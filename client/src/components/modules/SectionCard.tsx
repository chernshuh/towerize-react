import React from "react";

import "./SectionCard.css";

type Props = {
  id: number;
  title: string;
  content: string;
};

const SectionCard = (props: Props) => {
  return (
    <div className="SectionCard-container u-flexColumn">
      <div className="SectionCard-head u-flex">
        <div className="SectionCard-square">
          <div className="SectionCard-id">{props.id}.</div>
        </div>
        <h2 className="SectionCard-title">{props.title}</h2>
      </div>
      <p className="SectionCard-content">{props.content}</p>
    </div>
  );
};

export default SectionCard;
