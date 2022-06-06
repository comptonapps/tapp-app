import './AuthForm.css';

import React, { useState } from 'react'
import { loginUser, registerUser } from '../../action/creators/session';
import { useDispatch, useSelector } from 'react-redux';


function AuthForm() {
    const requests = useSelector(st => st.sessionState.requests);
    const dispatch = useDispatch();
    const [loginMode, setLoginMode] = useState(true);
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
    };
    const handleSubmit = (evt) => {
        evt.preventDefault();
        loginMode ? dispatch(loginUser({username: formData.username, password: formData.password})) : dispatch(registerUser(formData));
    }

    const toggleLogin = () => {
        setLoginMode(loginMode => !loginMode);
    };
    return (
        <div className="AuthForm">
            <h2>{loginMode ? "Login User" : "Register User"}</h2>
            <p>{loginMode? "Need to create an account?" : "Already Registered?"} <span><button onClick={toggleLogin}>{loginMode ? "Sign up here" : "Login here"}</button></span></p>
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
                    />
                </div>
                <div className="AuthForm-group">
                    <label htmlFor="last_name">last Name</label>
                    <input 
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        placeholder="Last Name"
                        onChange={handleChange}
                    />
                </div>
                <div className="AuthForm-group">
                    <label htmlFor="city">city</label>
                    <input 
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        placeholder="Current City"
                        onChange={handleChange}
                    />
                </div>
                <div className="AuthForm-group">
                    <label htmlFor="state">state</label>
                    <input 
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        placeholder="Current State"
                        onChange={handleChange}
                    />
                </div>
                </> }
                <button type="submit" disabled={requests > 0}>Submit</button>
            </form>
        </div>
        
    );
};

export default AuthForm;
