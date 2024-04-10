import React from "react";

import "./SingleSection.css";

type Props = {
  id: number;
  title: string;
  content: string;
  isFocused: boolean;
};

const SingleSection = (props: Props) => {
  return (
    <div
      className={
        props.isFocused
          ? "u-flexColumn SingleSection-container"
          : "u-fade u-flexColumn SingleSection-container"
      }
    >
      <div className="SingleSection-head u-flex">
        <div className="SingleSection-square">
          <div className="SingleSection-id">{props.id}.</div>
        </div>
        <h2 className="SingleSection-title">{props.title}</h2>
      </div>
      <p className="SingleSection-content">{props.content}</p>
    </div>
  );
};

export default SingleSection;
