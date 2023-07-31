import React, { useState } from "react";

export default function WorkerFrom({ registryAsWorker }) {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        await registryAsWorker(first_name, last_name);
    }

    return (
        <>
            <label>Registrer as worker:</label>
            <form onSubmit={handleSubmit}>
                <label>
                    Your first name
                </label>
                <input
                    type="text"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <label>
                    Your last name
                </label>
                <input
                    type="text"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input type="submit" />
            </form>
        </>
    )
}