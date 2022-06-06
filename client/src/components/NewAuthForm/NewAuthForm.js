import '../AuthForm/AuthForm.css';
import React, { useState } from 'react';
import { loginUser, registerUser } from '../../action/creators/session';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from 'react-google-autocomplete';


function NewAuthForm() {
    const error = useSelector(st => st.sessionState.error)
    const requests = useSelector(st => st.sessionState.requests);
    const dispatch = useDispatch();
    const [loginMode, setLoginMode] = useState(true);
    const [hasData, setHasData] = useState(true);
    const [formData, setFormData] = useState({ 
        username: "", 
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        city: "",
        state: ""
    })
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(data => {
            return {
                ...data,
                [name] : value
            }
        });
        setHasData(checkInputs());
    };
    const handleSubmit = (evt) => {
        evt.preventDefault();
        loginMode ? dispatch(loginUser({username: formData.username, password: formData.password})) : dispatch(registerUser(formData));
    }

    const toggleLogin = () => {
        setLoginMode(loginMode => !loginMode);
    };

    const handlePlaceSelection = (place) => {
        const city = place.address_components[0].long_name;
        const state = place.address_components[2].short_name;
        setFormData(data => {
            return {
                ...data,
                city,
                state
            }
        });
    }

    const checkInputs = () => {
        if (loginMode) {
            if (formData.username.length > 0 && formData.password.length > 0) {
                return true
            }
        } else {
            const results = Object.values(formData).filter(d => {
                return d !== ""
            });
            return results.length > 0
        }
        
    }

    return (
        <div className="AuthForm">
            <h2>{loginMode ? "Login User" : "Register User"}</h2>
            <p>{loginMode? "Need to create an account?" : "Already Registered?"} <span><button class="link-btn" onClick={toggleLogin}>{loginMode ? "Sign up here" : "Login here"}</button></span></p>
            { (error && error.length > 0) && <p style={{color: 'red'}}>{error}</p>}
            <form className="AuthForm-form" onSubmit={handleSubmit}>
                <div className="AuthForm-group">
                    <label htmlFor="username">
                        Username: 
                    </label>
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        placeholder="Enter Username"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="AuthForm-group">
                    <label htmlFor="password">
                        Password
                    </label>
                    <input 
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter Password"
                        onChange={handleChange}
                        required
                    />
                </div>
                { !loginMode && 
                <>
                <div className="AuthForm-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email Address"
                        onChange={handleChange}
                        required={ loginMode ? false : true }
                    />
                </div>
                <div className="AuthForm-group">
                    <label htmlFor="first_name">First Name</label>
                    <input 
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        placeholder="First Name"
                        onChange={handleChange}
                        required={ loginMode ? false : true }
                    />
                </div>
                <div className="AuthForm-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input 
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        placeholder="Last Name"
                        onChange={handleChange}
                        required={ loginMode ? false : true }
                    />
                </div>
                <div className="AuthForm-group" style={{display: 'none'}}>
                    <input 
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        placeholder="Current City"
                        onChange={handleChange}
                        required={ loginMode ? false : true }
                    />
                </div>
                <div className="AuthForm-group" style={{display: 'none'}}>
                    <input 
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        placeholder="Current State"
                        onChange={handleChange}
                        required={ loginMode ? false : true }
                    />
                </div>
                <div className="AuthForm-group">
                    <label htmlFor="location">Location</label>
                
                <Autocomplete 
                apiKey='AIzaSyA8hnYJdzVa7xLH3yESNKm6ZSunyyuASfw'
                style={{width: '650px', height: '30px'}}
                options={{componentRestrictions: {country: "us"}}}
                onPlaceSelected={place => {
                    handlePlaceSelection(place);
                }
            

                } />
                </div>
                </> }
                <button 
                    type="submit" 
                    

                >
                Submit
                </button>
            </form>
        </div>
        
    );
};

export default NewAuthForm;