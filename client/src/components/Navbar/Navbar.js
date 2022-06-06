import './Navbar.css';
import { NavLink, Link } from 'react-router-dom';
import React from 'react'

function Navbar() {
    return (
        <nav className="Navbar">
            <div className="Navbar-brand">
                <Link to="/"><p>What's on tApp?</p></Link>
            </div>
            <ul className="Navbar-menu">
                <NavLink to="/drinks"><li className="Navbar-link">Drinks</li></NavLink>
                <NavLink to="/places"><li className="Navbar-link">Places</li></NavLink>
                <NavLink to="/dashboard/"><li className="Navbar-link">Dash</li></NavLink>
                <NavLink to="/logout"><li className="Navbar-link">Logout</li></NavLink>
            </ul>
        </nav>
    )
}

export default Navbar;
