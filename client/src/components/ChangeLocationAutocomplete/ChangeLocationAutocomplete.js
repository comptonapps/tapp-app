import './ChangeLocationAutocomplete.css';
import ScreenOverlay from '../ScreenOverlay/ScreenOverlay';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CHANGE_LOCATION } from '../../action/types/session'
import Autocomplete from 'react-google-autocomplete';
import SectionTitle from '../SectionTitle/SectionTitle';



function ChangeLocationAutocomplete({setIsVisible, setHasLoaded, getData}) {
    const dispatch = useDispatch();
    const [location, setLocation] = useState({city: "", state: ""})

    const handleSubmit = (evt) => {
        evt.preventDefault();
        dispatch({type: CHANGE_LOCATION, payload: location });
        setIsVisible(false);
    }

    const handlePlaceSelection = (place) => {
        const address = place.formatted_address;
        const addressTokens = address.split(',');
        const city = addressTokens[0].trim();
        const state = addressTokens[1].trim();
        setLocation(location => {
            return {
                city,
                state
            }
        });
    }
    return (
        <ScreenOverlay>
            <form onSubmit={handleSubmit}>
                <SectionTitle title="Change Location"/>
                <div>
                <Autocomplete 
                apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                style={{width: '350px', height: '30px', marginBottom: '24px', paddingLeft: '8px'}}
                options={{componentRestrictions: {country: "us"}}}
                onPlaceSelected={place => {
                    handlePlaceSelection(place);
                }
                } />
                </div>
                <button type="submit">Update Location</button>
                <button onClick={() => setIsVisible(false)}>Cancel</button>
            </form>
        </ScreenOverlay>
    );
};

export default ChangeLocationAutocomplete;