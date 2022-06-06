import './EditPlaceModal.css';
import React, { useState } from 'react'
import ModalContainer from '../ModalContainer/ModalContainer'
import SectionTitle from '../SectionTitle/SectionTitle';
import { updatePlace } from '../../action/creators/places';
import { useDispatch } from 'react-redux';
import {
    ADD_NOTIFICATION,
    DELETE_NOTIFICATION
} from '../../action/types/notification'

function EditPlaceModal({toggle, place}) {
    const dispatch = useDispatch();
    const { name, address, city, state, zip, url="", phone=""} = place;
    const [formData, setFormData] = useState({name, address, city, state, zip, url, phone});
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData({
            ...formData,
            [name] : value
        })
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        dispatch(updatePlace(place.id, formData, (data, response, error) => {
            if (error) {
                alert('error');
            } else {
                toggle();
                dispatch({type: ADD_NOTIFICATION, payload: "Changes Saved!"});
                dispatch({type: DELETE_NOTIFICATION});
            }
        }))
        
    }
    return (
        <ModalContainer>
        <SectionTitle title={`Edit ${name}`} />
        <form onSubmit={handleSubmit} className="NewPlaceForm">
        <div className="group">
            <label>Name</label>
            <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                placeholder="Business Name"
                onChange={handleChange}
            />
        </div>
        <div className="group">
            <label>Address</label>
            <input 
                type="text"
                id="address"
                name="address"
                value={formData.address}
                placeholder="Business Address"
                onChange={handleChange}
            />
        </div>
        <div className="group">
            <label>City</label>
            <input 
                type="text"
                id="city"
                name="city"
                value={formData.city}
                placeholder="City"
                onChange={handleChange}
            />
        </div>
        <div className="group">
            <label>State</label>
            <input 
                type="text"
                id="state"
                name="state"
                value={formData.state}
                placeholder="State"
                onChange={handleChange}
            />
        </div>
        <div className="group">
            <label>Zip Code</label>
            <input 
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                placeholder="Zip"
                onChange={handleChange}
            />
        </div>
        <div className="group">
            <label>url</label>
            <input 
                type="text"
                id="url"
                name="url"
                value={formData.url}
                placeholder="Web Address"
                onChange={handleChange}
            />
        </div>
        <div className="group">
            <label>Phone</label>
            <input 
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                placeholder="Phone Number"
                onChange={handleChange}
            />
        </div>
        <button type="submit">Submit</button>
    </form>
            <button onClick={toggle}>Dismiss</button>
        </ModalContainer>
    )
}

export default EditPlaceModal;
