import './ChangeLocation.css';
import ScreenOverlay from '../ScreenOverlay/ScreenOverlay';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CHANGE_LOCATION } from '../../action/types/session'

function ChangeLocation({setIsVisible, setHasLoaded, getData}) {
    const dispatch = useDispatch();
    const [location, setLocation] = useState({city: "", state: ""})
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setLocation({
            ...location,
            [name]: value
        })
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        dispatch({type: CHANGE_LOCATION, payload: location });
        setIsVisible(false);
    }
    return (
        <ScreenOverlay>
            <form onSubmit={handleSubmit}>
                <input 
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter City"
                    value={location.city}
                    onChange={handleChange}
                />
                <input 
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Enter state"
                    value={location.state}
                    onChange={handleChange}
                />
                <button type="submit">Change Location</button>
                <button onClick={() => setIsVisible(false)}>Cancel</button>
            </form>
        </ScreenOverlay>
    );
};

export default ChangeLocation;
