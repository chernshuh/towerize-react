import React, { useEffect, useState } from "react";

import "./DisplayBlock.css";

type Props = {
  name: string;
  value: number;
};

const DisplayBlock = (props: Props) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div className="DisplayBlock-container">
      <h2>{props.name}</h2>
      <p>{value}</p>
    </div>
  );
};

export default DisplayBlock;
