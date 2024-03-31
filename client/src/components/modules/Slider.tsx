import React, { useState } from "react";

type Props = {
  startValue: number;
  endValue: number;
  defaultValue: number;
  step: number;
  onChange: (value: number) => void;
};

const Slider = (props: Props) => {
  const [value, setValue] = useState(props.defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    props.onChange(newValue);
  };

  return (
    <div>
      <input
        type="range"
        min={props.startValue}
        max={props.endValue}
        step={props.step}
        value={value}
        onChange={handleChange}
      />
      <span>{value}</span>
    </div>
  );
};

export default Slider;
