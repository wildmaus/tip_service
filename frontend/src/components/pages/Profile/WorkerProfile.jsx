import React from "react";


export default function WorkerProfile({ worker }) {
    return (
        <p>{worker.first_name} {worker.last_name}</p>
    )
}