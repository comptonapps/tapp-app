import "./Places.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Page from "../Page/Page";
import PageTitle from "../PageTitle/PageTitle";
import { getPlaces } from "../../action/creators/places";
import { Link } from "react-router-dom";
import LocationWidget from "../LocationWidget/LocationWidget";
import PlaceList from "../PlaceList/PlaceList";
import SearchBar from "../SearchBar/SearchBar";

function Places() {
  const dispatch = useDispatch();
  const { preferredLocation } = useSelector(st => st.sessionState);
  const { sortedResults, hasMore, places } = useSelector(st => st.placeState);
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (!sortedResults.length && hasMore) {
      dispatch(getPlaces());
    }
  }, [preferredLocation]);

  const clearResults = () => {
    setSearchResults([]);
  };

  const handleSearch = (evt, q) => {
    evt.preventDefault();
  };

  if (hasMore && !sortedResults.length) {
    <Page cls="Places">
      <PageTitle title="places" />
      <LocationWidget />
      <SearchBar />
      <h1>Loading....</h1>
    </Page>;
  }

  if (!hasMore && !sortedResults.length) {
    <Page cls="Places">
      <PageTitle title="places" />
      <LocationWidget />
      <SearchBar />
      <h1>No results found</h1>
    </Page>;
  }

  return (
    <Page cls="Places">
      <PageTitle title="places" />
      <LocationWidget />
      <SearchBar
        placeholder="Search Places"
        clearResults={clearResults}
        handleSearch={handleSearch}
      />
      <PlaceList
        places={
          searchResults.length > 0 ? (
            <h1>Search Results Detected</h1>
          ) : (
            sortedResults.map(id => places[id])
          )
        }
      />
    </Page>
  );
}

export default Places;
