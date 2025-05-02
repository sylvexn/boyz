/*
	Installed from https://reactbits.dev/ts/default/
*/

import React from "react";
import "./Iridescence.css";

interface IridescenceProps {
  color1?: string;
  color2?: string;
  color3?: string;
  duration?: number;
}

const Iridescence: React.FC<IridescenceProps> = ({
  color1 = "#00ff7f",
  color2 = "#4b00ff",
  color3 = "#00a4ff",
  duration = 10
}) => {
  return (
    <div className="iridescence-container">
      <div 
        className="iridescence-effect" 
        style={{
          background: `linear-gradient(125deg, ${color1}, ${color2}, ${color3}, ${color2}, ${color1})`,
          animationDuration: `${duration}s`
        }}
      />
    </div>
  );
};

export default Iridescence;
