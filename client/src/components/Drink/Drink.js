import "./Drink.css";
import Page from "../Page/Page";
import PlaceList from "../PlaceList/PlaceList";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../helpers/Axios";
import CONSTANTS from "../../constants";
import { gotDrink } from "../../action/creators/drinks";
import LocationWidget from "../LocationWidget/LocationWidget";
import DrinkRating from "../DrinkRating/DrinkRating";
import PageHeader from "../PageHeader/PageHeader";
import SectionTitle from "../SectionTitle/SectionTitle";

const { API_DRINK_ENDPOINT } = CONSTANTS;

function Drink() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const drink = useSelector(
    st => st.drinkState.sortedResults[`drink${id}`] || st.drinkState.drinks[id]
  );
  const { preferredLocation } = useSelector(st => st.sessionState);
  const [placeList, setPlaceList] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const getDrinkData = async () => {
    try {
      const { city, state } = preferredLocation;
      const response = await Axios.get(
        `/api${API_DRINK_ENDPOINT}/${id}?city=${city}&state=${state}`
      );
      const drink = response.data.drink;
      const placeList = drink.places;
      setPlaceList(list => placeList);
      delete drink.places;
      if (drink.num_ratings) {
        drink.num_ratings = +drink.num_ratings;
      }
      if (drink.rating) {
        drink.rating = Number(drink.rating);
      }
      dispatch(gotDrink(drink));
      setHasLoaded(loaded => true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setHasLoaded(false);
    getDrinkData();
  }, [preferredLocation]);

  if (!hasLoaded) {
    return <p>Loading....</p>;
  }

  return (
    <Page cls="Drink">
      <PageHeader>
        <div className="Drink-data">
          <h1>{drink.name}</h1>
          <h3>{drink.maker}</h3>
          <p>{drink.abv}% ABV</p>
        </div>
        <DrinkRating drink_id={id} />
      </PageHeader>

      <LocationWidget />
      <SectionTitle title="available at:" />
      {placeList.length > 0 && <PlaceList places={placeList} />}
    </Page>
  );
}

export default Drink;
