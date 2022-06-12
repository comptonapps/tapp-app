import "./Oops.css";
import Page from "../Page/Page";
import { useHistory } from "react-router-dom";

const Oops = () => {
  const history = useHistory();
  // const goBack = () => {
  //     history.goBack();
  // }
  return (
    <Page cls="Oops">
      <h1>404 - Oops, it appears that you're knocking on the wrong door</h1>
      <button className="std-btn" onClick={() => history.goBack()}>
        Go Back
      </button>
    </Page>
  );
};

export default Oops;
