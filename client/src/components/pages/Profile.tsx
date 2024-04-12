import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { googleLogout } from "@react-oauth/google";

import User from "../../../../shared/User";
import Tower from "../../../../shared/Tower";

import { get } from "../../utilities";
import { requestDelete } from "../../utilities";

import TowerCard from "../modules/TowerCard";
import "./Profile.css";

type Props = { userId: string | undefined; handleLogout: () => void };

const Profile = (props: Props) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [towers, setTowers] = useState<Tower[]>([]);

  useEffect(() => {
    get("/api/user", { userid: props.userId }).then((userObj) => setUser(userObj));
  }, []);

  useEffect(() => {
    get("/api/towers", { creator_id: props.userId }).then((towers) => {
      setTowers(towers);
    });
  }, []);

  const [selectedTowers, setSelectedTowers] = useState<string[]>([]); // Selected tower IDs

  const handleLogout = props.handleLogout;

  const handleSelect = (towerId: string) => {
    if (selectedTowers.includes(towerId)) {
      setSelectedTowers(selectedTowers.filter((id) => id !== towerId));
    } else {
      setSelectedTowers([...selectedTowers, towerId]);
    }
  };

  const handleDelete = () => {
    if (selectedTowers.length === 0) return;
    selectedTowers.forEach((towerId) => {
      requestDelete("/api/tower", { tower_id: towerId });
    });
    setTowers(towers.filter((tower) => !selectedTowers.includes(tower._id)));
    setSelectedTowers(selectedTowers.filter((id) => !selectedTowers.includes(id)));
  };

  let towerList: any = null;
  const hasTowers = towers.length > 0;

  if (hasTowers) {
    towerList = towers.map((tower) => (
      <div key={tower._id} onClick={() => handleSelect(tower._id)}>
        <TowerCard
          tower={{ radius: tower.radius, gradient: tower.gradient }}
          date={tower.timestamp}
        />
      </div>
    ));
  } else {
    towerList = (
      <div className="Profile-noTowers noto-sans">
        You haven't created any towers yet. Try <a href="/creation">create now</a>.
      </div>
    );
  }

  return (
    <div className="u-flex">
      <div className="Profile-sidebar u-flexColumn">
        <div className="Profile-avatarContainer">
          <div className="Profile-avatar" />
        </div>
        <div className="Profile-name noto-sans">{user?.name}</div>
        <div
          className="Profile-button"
          onClick={() => {
            googleLogout();
            handleLogout();
            navigate("/");
          }}
        >
          Logout
        </div>
      </div>
      <div className="Profile-container u-flexColumn">
        <div className="Profile-paddingDiv">
          <div className="Profile-greeting">How's today? Your towers are all here.</div>
          <div className="Profile-towersContainer">{towerList}</div>
          <div className="Profile-options">
            <div
              className={
                selectedTowers.length > 0
                  ? "Profile-option u-useRed"
                  : "Profile-option u-useRed u-fade"
              }
              onClick={handleDelete}
            >
              Delete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
