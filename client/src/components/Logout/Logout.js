import "./Logout.css";
import React from "react";
import Page from "../Page/Page";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../action/types/global";

function Logout() {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch({ type: LOGOUT });
  };
  return (
    <Page cls="Logout">
      <div className="Logout-container">
        <h1>Are you sure?</h1>
        <button onClick={handleClick} className="std-btn">
          Logout
        </button>
      </div>
    </Page>
  );
}

export default Logout;
