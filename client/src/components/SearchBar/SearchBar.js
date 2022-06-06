import './SearchBar.css';
import React, { useState, useEffect } from 'react';


function SearchBar({placeholder, handleSearch, clearResults}) {
    const [query, setQuery] = useState("");

    const handleChange = (evt) => {
        setQuery(q => evt.target.value);
        if (evt.target.value === "") {
            clearResults();
        }
    };

    const handleSubmit = (evt) => {
        handleSearch(evt, query);
    };

    return (
        <div className="SearchBar">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="query"
                    id="query"
                    value={query}
                    placeholder={placeholder}
                    onChange={handleChange}
                />
                <button type="submit" class="std-btn" disabled={query === ""}>Search</button>
            </form>
        </div>
    )
}

export default SearchBar;
