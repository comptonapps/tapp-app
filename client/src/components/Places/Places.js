import "./Places.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Page from "../Page/Page";
import PageTitle from "../PageTitle/PageTitle";
import { getPlaces } from "../../action/creators/places";
import LocationWidget from "../LocationWidget/LocationWidget";
import PlaceList from "../PlaceList/PlaceList";
import SearchBar from "../SearchBar/SearchBar";
import Axios from "../../helpers/Axios";

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

  const handleSearch = async (evt, q) => {
    evt.preventDefault();
    const url = `http://localhost:3003/api/place/search?q=${q}&city=${preferredLocation.city}&state=${preferredLocation.state}`;
    const queryResults = await Axios.get(url);
    setSearchResults(queryResults.data.results);
  };

  if (hasMore && !sortedResults.length) {
    return (
      <Page cls="Places">
        <PageTitle title="places" />
        <LocationWidget />
        <SearchBar />
        <h1>Loading....</h1>
      </Page>
    );
  }

  if (!hasMore && !sortedResults.length) {
    return (
      <Page cls="Places">
        <PageTitle title="places" />
        <LocationWidget />
        <SearchBar />
        <h1>No results found</h1>
      </Page>
    );
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
          searchResults && searchResults.length > 0
            ? searchResults
            : sortedResults.map(id => places[id])
        }
      />
    </Page>
  );
}

export default Places;
