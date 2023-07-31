import React, { useEffect, useState } from "react";
import WorkerItem from "./WorkerItem";

export default function Workers() {

    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
        }
        fetch('http://localhost:8000/workers/', requestOptions)
            .then(response => response.json())
            .then(data => setWorkers(data))
    }, [])

    return (
        <>
            <h3>Workers:</h3>
            {workers.length === 0 ? (
                <p>There is no workers yet</p>
            ) : (
                <>
                    <ul>
                        {workers.map(worker => <WorkerItem worker={worker} key={worker.id} />)}
                    </ul>
                </>
            )}
        </>
    )
}