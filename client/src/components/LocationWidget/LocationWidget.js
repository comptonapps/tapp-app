import './LocationWidget.css';
import { useSelector } from 'react-redux';
import React, { useState } from 'react'
import ChangeLocationAutocomplete from '../ChangeLocationAutocomplete/ChangeLocationAutocomplete';

function LocationWidget() {
    const { city, state } = useSelector(st => st.sessionState.preferredLocation);
    const [showChangeLocation, setShowChangeLocation] = useState(false);
    return (
        <div className="LocationWidget">
            <p>Showing results for {city}, {state}</p>
            <button onClick={() => setShowChangeLocation(true)}>Change Location</button>
            {showChangeLocation && <ChangeLocationAutocomplete setIsVisible={setShowChangeLocation}/>}
        </div>
    )
}

export default LocationWidget;
