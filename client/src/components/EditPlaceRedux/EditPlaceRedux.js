import "./EditPlaceRedux.css";
import "../PlaceInfo/PlaceInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Axios from "../../helpers/Axios";
import Page from "../Page/Page";
import EditDraughtList from "../EditDraughtList/EditDraughtList";
import SearchUntappd from "../SearchUntappd/SearchUntappd";
import EditPlaceModal from "../EditPlaceModal/EditPlaceModal";
import SectionTitle from "../SectionTitle/SectionTitle";
import React, { useState } from "react";
import CONSTANTS from "../../constants";

const { API_BASE_URL, API_USER_ENDPOINT, API_PLACE_ENDPOINT } = CONSTANTS;

const EDIT_PLACE_REQUEST = "EDIT_PLACE_REQUEST";
const EDIT_PLACE_SUCCESS = "EDIT_PLACE_SUCCESS";
const EDIT_DRAUGHT_SUCCESS = "EDIT_DRAUGHT_SUCCESS";
const EDIT_PLACE_ERROR = "EDIT_PLACE_ERROR";

function EditPlaceRedux() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userId = useSelector(st => st.sessionState.user.id);
  const { place, draughts, requests } = useSelector(st => st.editPlaceState);
  const [showEditPlaceForm, setShowEditPlaceForm] = useState(false);
  const [showAddDraughtModal, setShowAddDraughtModal] = useState(false);
  const [showConfirmDraughtChange, setShowConfirmDraughtChange] = useState(
    false
  );

  React.useEffect(() => {
    dispatch(getDraughtData());
    return () => dispatch({ type: "RESET_EDIT_STATE" });
  }, []);

  const getDraughtData = () => {
    return async function(dispatch) {
      try {
        dispatch({ type: EDIT_PLACE_REQUEST });
        const response = await Axios.get(
          `${API_USER_ENDPOINT}/${userId}${API_PLACE_ENDPOINT}/${id}`
        );
        dispatch(gotDraughtData(response.data));
      } catch (e) {
        console.log(e);
      }
    };
  };

  const gotDraughtData = data => {
    const draughtsObj = {};
    const arr = data.place.draughts || [];
    arr.forEach(d => {
      draughtsObj[d.drink_id] = d;
    });
    delete data.place.draughts;
    data.draughts = draughtsObj;
    return { type: EDIT_PLACE_SUCCESS, payload: data };
  };

  const toggleEditPlaceForm = () => {
    setShowEditPlaceForm(b => !b);
  };

  const toggleAddDraughtModal = () => {
    setShowAddDraughtModal(b => !b);
  };

  const toggleConfirmDraughtChange = () => {
    setShowConfirmDraughtChange(b => !b);
  };

  if (requests) {
    return <h1>Loading....</h1>;
  }

  return (
    <Page cls="EditPlaceRedux">
      {place && (
        <>
          {showAddDraughtModal && (
            <SearchUntappd toggle={toggleAddDraughtModal} place_id={id} />
          )}
          {showEditPlaceForm && (
            <EditPlaceModal place={place} toggle={toggleEditPlaceForm} />
          )}
          <div className="PlaceInfo">
            <h1>{place.name}</h1>
            <p>{place.address}</p>
            <p>
              {place.city}, {place.state} {place.zip}
            </p>
            {place.phone && <p>{place.phone}</p>}
            {place.url && <p>{place.url}</p>}
            <button onClick={toggleEditPlaceForm}>
              Edit {place.name} Info
            </button>
          </div>

          <SectionTitle title="EDIT DRAUGHT LIST">
            <button onClick={toggleAddDraughtModal}>Add New Draught</button>
          </SectionTitle>
          <EditDraughtList
            draughts={Object.values(draughts) || []}
            place_id={id}
          />
        </>
      )}
    </Page>
  );
}

export default EditPlaceRedux;
