import React, { useEffect, useState } from "react";
import PlaceItem from "./PlaceItem";

export default function Places() {

    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
        }
        fetch('http://localhost:8000/places/', requestOptions)
            .then(response => response.json())
            .then(data => setPlaces(data))
    }, [])

    return (
        <>
            <h3>Places:</h3>
            {places.length === 0 ? (
                <p>There is no places yet</p>
            ) : (
                <>
                    <ul>
                        {places.map(place => <PlaceItem place={place} key={place.id} />)}
                    </ul>
                </>
            )}
        </>
    )
}