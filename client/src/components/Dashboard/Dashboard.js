import "./Dashboard.css";

import React from "react";
import Page from "../Page/Page";
import { useSelector } from "react-redux";
import PageTitle from "../PageTitle/PageTitle";
import PlaceList from "../PlaceList/PlaceList";
import DrinkList from "../DrinkList/DrinkList";
import SectionTitle from "../SectionTitle/SectionTitle";

function Dashboard() {
  const requests = useSelector(st => st.sessionState.requests);
  const { place_ratings, drink_ratings, places_owned } = useSelector(
    st => st.sessionState.user
  );
  const places = useSelector(st => st.placeState.places);
  const drinks = useSelector(st => st.drinkState.drinks);
  const placesRated = Object.values(place_ratings) || [];
  const drinksRated = Object.values(drink_ratings) || [];
  const placesOwned = Object.values(places_owned) || [];
  if (requests) {
    return <p>Loading....</p>;
  }
  return (
    <Page cls="Dashboard">
      <PageTitle title="Dashboard" />

      <div>
        <SectionTitle title="Your Place Ratings" />
        {placesRated && placesRated.length > 0 ? (
          <PlaceList
            dashboard={true}
            places={placesRated.map(pr => {
              const place = places[pr.place_id];
              if (place) {
                place.rating = pr.rating;
                return place;
              }
              return [];
            })}
          />
        ) : (
          <h3>No Places Rated</h3>
        )}
      </div>
      <div>
        <SectionTitle title="Your Drink Ratings" />
        {drinksRated && drinksRated.length > 0 ? (
          <DrinkList
            dashboard={true}
            drinks={drinksRated.map(dr => {
              const drink = drinks[dr.drink_id];
              if (drink) {
                drink.rating = dr.rating;
                return drink;
              }
              return {};
            })}
          />
        ) : (
          <h3>No Drinks Rated</h3>
        )}
      </div>
      <div>
        <SectionTitle title="Your Businesses" />
        {placesOwned && placesOwned.length ? (
          <PlaceList
            hoverable={false}
            places={placesOwned.map(po => {
              const place = places[po.place_id];
              return place;
            })}
          />
        ) : (
          <h3>No places owned</h3>
        )}
      </div>
    </Page>
  );
}

export default Dashboard;
