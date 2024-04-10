import React from "react";
import { useLocation, useNavigate } from "react-router";

import "./NavBar.css";

type Props = { userId: string | undefined };

const NavBar = (props: Props) => {
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <div className="NavBar-container noto-sans">
      <div
        className={
          currentPath === "/creation"
            ? "NavBar-home-flame newsreader"
            : "NavBar-home-white newsreader"
        }
        onClick={() => navigate("/")}
      >
        Towerize
      </div>
      <div className="NavBar-links">
        <div
          className={currentPath === "/" ? "u-button-white-no-border" : "u-button-black-no-border"}
          onClick={() => navigate("/profile")}
        >
          Profile
        </div>
        <div
          className={currentPath === "/" ? "u-button-white-no-border" : "u-button-black-no-border"}
          onClick={() => navigate("/instructions")}
        >
          Instructions
        </div>
        <div
          className={currentPath === "/" ? "u-button-white" : "u-button-black"}
          onClick={() => navigate("/creation")}
        >
          Get Started
          <span className="material-symbols-outlined">arrow_outward</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
