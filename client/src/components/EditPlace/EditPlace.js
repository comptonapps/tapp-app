import "./EditPlace.css";
import "../PlaceInfo/PlaceInfo.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Axios from "../../helpers/Axios";
import Page from "../Page/Page";
import SectionTitle from "../SectionTitle/SectionTitle";
import EditDraughtList from "../EditDraughtList/EditDraughtList";
import SearchUntappd from "../SearchUntappd/SearchUntappd";
import EditPlaceModal from "../EditPlaceModal/EditPlaceModal";

function EditPlace() {
  const dispatch = useDispatch();
  const { id: place_id } = useParams();
  const { id: user_id } = useSelector(st => st.sessionState.user);
  const [place, setPlace] = useState(null);
  const [showEditPlaceForm, setShowEditPlaceForm] = useState(false);
  const [showAddDraughtModal, setShowAddDraughtModal] = useState(false);
  const [showConfirmDraughtChange, setShowConfirmDraughtChange] = useState(
    false
  );

  useEffect(() => {
    getDraughtData();
    // return () => {dispatch({type: 'RESET_STATE'})};
    return;
  });

  const getDraughtData = async () => {
    const response = await Axios.get(`/api/user/1/place/${place_id}`);
    console.log(response.data);
    setPlace(response.data.place);
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

  return (
    <Page cls="EditPlace">
      {place && (
        <>
          {showAddDraughtModal && (
            <SearchUntappd toggle={toggleAddDraughtModal} place_id={place_id} />
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
          <EditDraughtList draughts={place.draughts || []} />
        </>
      )}
    </Page>
  );
}

export default EditPlace;
