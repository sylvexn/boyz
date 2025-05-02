/*
	Installed from https://reactbits.dev/ts/default/
*/

import React from "react";
import "./Aurora.css";

interface AuroraProps {
  color1?: string;
  color2?: string;
  color3?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  color1 = "#00ff7f",
  color2 = "#61dca3",
  color3 = "#61b3dc"
}) => {
  return (
    <div className="aurora-container">
      <div 
        className="aurora-effect" 
        style={{
          background: `linear-gradient(45deg, ${color1}, ${color2}, ${color3}, ${color2}, ${color1})`,
        }}
      />
    </div>
  );
};

export default Aurora;
