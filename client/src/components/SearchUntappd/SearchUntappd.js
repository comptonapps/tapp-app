import './SearchUntappd.css';
import ModalContainer from '../ModalContainer/ModalContainer';
import React, { useState } from 'react';
import Axios from '../../helpers/Axios';
import AddDraughtCell from '../AddDraughtCell/AddDraughtCell';
import CONSTANTS from '../../constants';
import { useDispatch } from 'react-redux';

const { 
    API_BASE_URL, 
    API_PLACE_ENDPOINT, 
    API_DRAUGHT_ENDPOINT
} = CONSTANTS;


function SearchUntappd({toggle, place_id}) {   
    const dispatch = useDispatch();
    const [formData, setFormData] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [fetchingData, setFetchingData] = useState(false);
    
    const handleChange = (evt) => {
        const { value } = evt.target;
        setFormData(d => value);
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setFetchingData(true);
        const response = await Axios.get(`http://localhost:3003/drink/untappd?q=${encodeURIComponent(formData)}`);
        setSearchResults(response.data.results);
        setFormData("");
        setFetchingData(false);
    }

    const handleSelection = async (isActive, result) => {
        return dispatch(getNewDraught(isActive, result, toggle));
    };

    const getNewDraught = (isActive, result, completion) => {
        const obj = { active: isActive, drink: result }
        return async function(dispatch) {
            try {
                const response = await Axios.post(`${API_BASE_URL}${API_PLACE_ENDPOINT}/${place_id}${API_DRAUGHT_ENDPOINT}/drink`, obj);
                console.log(response.data);
                dispatch(gotNewDraught(response.data));
                return completion();
            } catch(e) {
                console.log(e.response);
            }
        }
    }

    function gotNewDraught(data) {
        const storeObj = {};
        storeObj[data.draught.drink_id] = { ...data.draught, drink: data.drink};
        return { type: 'NEW_DRAUGHT_SUCCESS', payload: storeObj }
    }

    return (
        <ModalContainer>
            <div className="SearchUntappd">
                <div className="SearchUntappd-header">
                <h1>Search Untappd</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="untappd">Search Untappd</label>
                    <input 
                        type="text"
                        name="untappd"
                        id="untappd"
                        placeholder="Search for a drink"
                        onChange={handleChange}
                        value={formData}
                    />
                    <button type="submit" disabled={fetchingData}>Search</button>
                    <button onClick={toggle}>Cancel</button>
                </form>
                </div>
                <div className="results-container">
                    {fetchingData && <h3>Loading....</h3>}
                    {searchResults.map(d => {
                        return <AddDraughtCell key={d.untappd_id} result={d} handleSelection={handleSelection}/>
                    })}
                </div>
            </div>
            
        </ModalContainer> 
    )
}

export default SearchUntappd;
