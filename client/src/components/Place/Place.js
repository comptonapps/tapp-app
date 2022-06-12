import "./Place.css";
import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Page from "../Page/Page";
import DrinkList from "../DrinkList/DrinkList";
import Axios from "../../helpers/Axios";
import CONSTANTS from "../../constants";
import GMap from "../Test/Gmap";
import PlaceRating from "../PlaceRating/PlaceRating";
import PageHeader from "../PageHeader/PageHeader";

const { API_PLACE_ENDPOINT } = CONSTANTS;

function Place() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const place = useSelector(st => st.placeState.places[id]);
  const placesOwned = useSelector(st => st.sessionState.user.places_owned);
  const [draughtList, setDraughtList] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    getPlaceData();
  }, []);

  const isOwnedBySessionUser = () => {
    if (placesOwned && placesOwned.length) {
      if (placesOwned.find(po => +po.place_id === +id)) {
        return true;
      }
    }
    return false;
  };

  const getPlaceData = async () => {
    try {
      const response = await Axios.get(`/api${API_PLACE_ENDPOINT}/${id}`);
      const place = response.data.place;
      const drinks = place.drinks;
      delete place.drinks;
      dispatch({
        type: "PLACES_INSERT_RECORD",
        payload: { [place.id]: place }
      });
      setDraughtList(d => drinks || []);
      setHasLoaded(true);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleMap = () => {
    setShowMap(s => !s);
  };
  return (
    <Page cls="Place">
      {place && (
        <PageHeader>
          <div className="Place-data">
            <h1>{place.name}</h1>
            <h3>{place.address}</h3>
            <h3>
              {place.city}, {place.state} {place.zip}
            </h3>
            {place.url && <p>{place.url}</p>}
            {place.phone && <p>{place.phone}</p>}
          </div>

          <div className="Place-control">
            {!placesOwned[id] && <PlaceRating place_id={id} />}
            {place && (
              <button onClick={toggleMap} class="control-btn">
                Show Map
              </button>
            )}
            {placesOwned[id] && (
              <Link to={`/places/${place.id}/edit`} class="control-btn">
                Edit {`${place.name}`}
              </Link>
            )}
          </div>
        </PageHeader>
      )}

      {showMap && <GMap lat={place.lat} lng={place.lng} toggle={toggleMap} />}
      {isOwnedBySessionUser() && (
        <button onClick={() => history.push(`/places/${id}/edit`)}>
          Edit Place
        </button>
      )}
      {!draughtList.length && !hasLoaded && <h2>LOADING DRAUGHT LIST....</h2>}
      {!draughtList.length && hasLoaded && <p>No current draughts</p>}
      <DrinkList drinks={draughtList} />
    </Page>
  );
}

export default Place;

//{draughtList.map(d => <Link to={`/drinks/${d.id}`} key={`drink${d.id}`}><p>{d.name}</p></Link>)}
