import "./EditDraughtCell.css";
import React, { useState } from "react";
import Cell from "../Cell/Cell";
import { useDispatch } from "react-redux";
import Axios from "../../helpers/Axios";
import CONSTANTS from "../../constants";

const { API_BASE_URL, API_PLACE_ENDPOINT, API_DRINK_ENDPOINT } = CONSTANTS;

const EDIT_PLACE_REQUEST = "EDIT_PLACE_REQUEST";
const EDIT_PLACE_SUCCESS = "EDIT_PLACE_SUCCESS";
const EDIT_DRAUGHT_SUCCESS = "EDIT_DRAUGHT_SUCCESS";
const EDIT_PLACE_ERROR = "EDIT_PLACE_ERROR";
const DELETE_DRAUGHT_SUCCESS = "DELETE_DRAUGHT_SUCCESS";

function EditDraughtCell({ draught, place_id }) {
  const dispatch = useDispatch();

  const handleStatusClick = async (id, active) => {
    dispatch(changeDraughtStatus(id, active));
  };

  const changeDraughtStatus = (id, active) => {
    return async function(dispatch) {
      try {
        dispatch({ type: EDIT_PLACE_REQUEST });
        const response = await Axios.patch(
          `/place/${place_id}/draught/drink/${id}`,
          { active: active }
        );
        dispatch(changedDraughtStatus(response.data));
      } catch (e) {
        dispatch({ type: EDIT_PLACE_ERROR, error: "bad request" });
      }
    };
  };

  function changedDraughtStatus(data) {
    return { type: EDIT_DRAUGHT_SUCCESS, payload: data.draught };
  }

  const handleDeleteClick = drink_id => {
    dispatch(deleteDraught(place_id, drink_id));
  };

  const deleteDraught = (place_id, drink_id) => {
    return async function(dispatch) {
      try {
        dispatch({ type: EDIT_PLACE_REQUEST });
        const response = await Axios.delete(
          `${API_PLACE_ENDPOINT}/${place_id}/draught${API_DRINK_ENDPOINT}/${drink_id}`
        );
        console.log(response.status);
        dispatch({ type: DELETE_DRAUGHT_SUCCESS, payload: { id: drink_id } });
      } catch (e) {
        dispatch({ type: EDIT_PLACE_ERROR, error: "error deleting draught" });
      }
    };
  };

  return (
    <Cell className="edit">
      <div className="EditDraughtCell-info">
        <h3>{draught.drink.name}</h3>
        <p>{draught.drink.maker}</p>
        <p>Status: {draught.active ? "ACTIVE" : "OFFLINE"}</p>
      </div>
      <div className="EditDraughtCell-control">
        <button
          onClick={() => handleStatusClick(draught.drink_id, !draught.active)}
        >
          {draught.active ? "Pull Offline" : "Put Online"}
        </button>
        <button onClick={() => handleDeleteClick(draught.drink_id)}>
          DELETE
        </button>
      </div>
    </Cell>
  );
}

export default EditDraughtCell;
