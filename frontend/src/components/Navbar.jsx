import React from "react";
import { Link } from "react-router-dom";
import UserInfo from "./UserInfo/UserInfo";
import './Navbar.css';

export default function Navbar() {
    return (
        <div className={'navbar'}>
            <Link to="/">Home</Link>
            <Link to="/buy">Buy</Link>
            <Link to="/profile">Profile</Link>
            <UserInfo />
        </div>
    )
}