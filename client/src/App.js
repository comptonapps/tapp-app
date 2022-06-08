import "./App.css";
import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Routes from "./components/Routes";
import { useSelector, useDispatch } from "react-redux";
import { refreshSessionUser } from "./action/creators/session";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const user = useSelector(st => st.sessionState.user);
  const notification = useSelector(st => st.notificationState.message);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(refreshSessionUser());
    }
  }, []);

  useEffect(() => {
    if (notification) {
      toast(notification);
    }
  }, [notification]);
  return (
    <div className="App">
      <ToastContainer position="top-center" closeOnClick />
      <Navbar />
      <Routes />
    </div>
  );
}

export default App;
