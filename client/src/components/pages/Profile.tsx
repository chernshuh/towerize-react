import React from "react";

import TowerCard from "./TowerCard";
import "./Profile.css";

type Props = {};

const Profile = (props: Props) => {
  return (
    <div className="u-flex">
      <div className="Profile-sidebar u-flexColumn">
        <div className="Profile-avatarContainer">
          <div className="Profile-avatar" />
        </div>
        <div className="Profile-name noto-sans">Venturino</div>
        <div className="Profile-button">Switch Account</div>
        <div className="Profile-button">Logout</div>
      </div>
      <div className="Profile-container u-flexColumn">
        <div className="Profile-greeting">How's today? Your towers are all here.</div>
        <div className="Profile-towersContainer">
          <TowerCard
            tower={{ radius: 0.7, gradient: 4 }}
            date="2025-13-32 25:61:61"
            isFocused={false}
          />
          <TowerCard
            tower={{ radius: 0.7, gradient: 8 }}
            date="2025-13-32 25:61:61"
            isFocused={true}
          />
        </div>
        <div className="Profile-options">
          <div className="Profile-option u-useRed">Delete</div>
          <div className="Profile-option u-useFlame">Export</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
