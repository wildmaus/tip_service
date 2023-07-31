import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context";
import WorkerForm from "../Home/Workers/WorkerForm";
import Authenticate from "../Authenticate";
import PlaceItem from "../Home/Places/PlaceItem";
import WorkerProfile from "./WorkerProfile";

export default function Profile() {
    const { user, wallet } = useContext(UserContext);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${access}`
            },
        };
        fetch('http://localhost:8000/users/me/', requestOptions)
            .then(response => response.json())
            .then(data => setProfile(data))
    }, [])

    const registryAsWorker = async (first_name, last_name) => {
        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                'first_name': first_name,
                'last_name': last_name,
            }),
        };
        fetch('http://localhost:8000/workers/', requestOptions)
            .then(response => response.json())
            .then(data => setProfile({ ...profile, worker: data }))
    }

    const registerNewPlace = async (name, address) => {
        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                'name': name,
                'address': address,
            }),
        };
        fetch('http://localhost:8000/places/', requestOptions)
            .then(response => response.json())
            .then(data => setProfile({ ...profile, places: [...profile.places, data] }))
    }

    return (
        <>
            <h1>Profile</h1>
            {(!user || !wallet) && (
                <>
                    <p>Please authenticate</p>
                    <Authenticate />
                </>
            )}
            {user && wallet && (
                <>
                    {profile.worker ? (
                        <>
                            <h4>Your worker profile:</h4>
                            <WorkerProfile worker={profile.worker} />
                        </>
                    ) : (
                        <>
                            <WorkerForm registryAsWorker={registryAsWorker} />
                        </>
                    )}
                    {/* places form and manage */}
                </>
            )}

        </>
    )
}