import './CreatePlace.css';
import '../NewPlaceForm/NewPlaceForm.css'
import React, {useState} from 'react';
import Page from '../Page/Page';
import PageTitle from '../PageTitle/PageTitle';
import { useDispatch } from 'react-redux';
import { useHistory  } from 'react-router-dom';
import { createPlace } from '../../action/creators/places'

function CreatePlace() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        url: "",
        phone: ""
    });

    const handleChange = (evt) => {
        const {name, value} = evt.target;
        setFormData({
            ...formData,
            [name] : value
        });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        dispatch(createPlace(formData, (id) => {history.push(`/places/${id}/edit`)}));
    }
    return (
        <Page cls="CreatePlace">
            <PageTitle title="Create New Place" />
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
        </Page>
    )
}

export default CreatePlace
