import React from "react";

import SingleTower from "../modules/SingleTower";

import "./Home.css";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="Home-container">
      <div className="Home-towers">
        <div>
          <SingleTower
            tower={{ radius: 0.7, gradient: 4 }}
            canvas={{ width: 100, height: 400 }}
            plainStyle={true}
            rotating={true}
          />
        </div>
        <div>
          <SingleTower
            tower={{ radius: 1.4, gradient: 4 }}
            canvas={{ width: 100, height: 400 }}
            plainStyle={true}
            rotating={true}
          />
        </div>
        <div>
          <SingleTower
            tower={{ radius: 2.1, gradient: 4 }}
            canvas={{ width: 120, height: 400 }}
            plainStyle={true}
            rotating={true}
          />
        </div>
        <div>
          <SingleTower
            tower={{ radius: 0.7, gradient: 2.4 }}
            canvas={{ width: 160, height: 400 }}
            plainStyle={true}
            rotating={true}
          />
        </div>
        <div className="Home-texts">Towerize</div>
        <div>
          <SingleTower
            tower={{ radius: 0.7, gradient: 6 }}
            canvas={{ width: 100, height: 400 }}
            plainStyle={true}
            rotating={true}
          />
        </div>
      </div>
      <div className="Home-copyright noto-sans">
        made by {""}
        <a href="https://www.github.com/chernshuh" target="_blank" className="Home-link">
          github.com/chernshuh
        </a>
      </div>
    </div>
  );
};

export default Home;
