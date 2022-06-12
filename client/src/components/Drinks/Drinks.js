import "./Drinks.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDrinks } from "../../action/creators/drinks";
import Axios from "../../helpers/Axios";
import Page from "../Page/Page";
import PageTitle from "../PageTitle/PageTitle";
import DrinkList from "../DrinkList/DrinkList";
import SearchBar from "../SearchBar/SearchBar";
import CONSTANTS from "../../constants";

const { API_DRINK_ENDPOINT } = CONSTANTS;

function Drinks() {
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState(null);
  const { drinks, sortedResults: drinkIds, hasMore } = useSelector(
    st => st.drinkState
  );

  useEffect(() => {
    if (hasMore && !drinkIds.length) {
      dispatch(getDrinks());
    }
  }, []);

  if (hasMore && !drinkIds.length) {
    return <p>Loading....</p>;
  }

  if (!hasMore && !drinkIds.length) {
    return <p>No drinks found</p>;
  }

  const clearResults = () => {
    setSearchResults(null);
  };

  const handleClick = () => {
    dispatch(getDrinks());
  };

  const handleSearch = async (evt, q) => {
    evt.preventDefault();
    const response = await Axios.get(
      `/api${API_DRINK_ENDPOINT}/search?q=${encodeURIComponent(q)}`
    );
    setSearchResults(response.data.drinks);
  };

  return (
    <Page cls="Drinks">
      <PageTitle title="Drinks" />
      <SearchBar
        placeholder="Search Drinks"
        clearResults={clearResults}
        handleSearch={handleSearch}
      />
      {searchResults && searchResults.length === 0 ? (
        <h3>No results found</h3>
      ) : (
        <DrinkList
          drinks={
            searchResults !== null
              ? searchResults
              : drinkIds.map(id => drinks[id])
          }
        />
      )}
      {hasMore && !searchResults && (
        <button onClick={handleClick}>Get More Drinks</button>
      )}
      {!hasMore && !searchResults && <h2>-- End of Results --</h2>}
    </Page>
  );
}

export default Drinks;
