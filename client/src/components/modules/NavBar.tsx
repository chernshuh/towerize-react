import React from "react";
import { useLocation, useNavigate } from "react-router";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

import "./NavBar.css";

type Props = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
};

const GOOGLE_CLIENT_ID = "692003849253-cs1pp74i51tf8r4psv73qve0lgbhljb4.apps.googleusercontent.com";

const NavBar = (props: Props) => {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const handleLogin = (credentialResponse: CredentialResponse) => {
    props.handleLogin(credentialResponse);
    // other things
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
          {props.userId ? (
            <div
              className={
                currentPath === "/" ? "u-button-white-no-border" : "u-button-black-no-border"
              }
              onClick={() => navigate("/profile")}
            >
              Profile
            </div>
          ) : (
            <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Error Logging in")} />
          )}
          <div
            className={
              currentPath === "/" ? "u-button-white-no-border" : "u-button-black-no-border"
            }
            onClick={() => navigate("/introduction")}
          >
            Introduction
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
    </GoogleOAuthProvider>
  );
};

export default NavBar;
