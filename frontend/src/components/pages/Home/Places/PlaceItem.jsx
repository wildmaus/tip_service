import React, { useState } from "react";
import WorkerItem from "../Workers/WorkerItem";

export default function PlaceItem({ place }) {
    const [showDrop, setShowDrop] = useState(false)

    return (
        <li>
            <div>
                <h4>{place.name}</h4>
                <p>Address: {place.address}</p>
                {place.workers.length === 0 ? (
                    <p>There's no workers yet</p>
                ) : (
                    <>
                        <button onClick={() => setShowDrop(!showDrop)}>
                            {showDrop ? 'Hide workers' : 'Show workers'}
                        </button>
                        {showDrop && (
                            <ul>
                                {place.workers.map(
                                    worker => <WorkerItem worker={worker} />
                                )}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </li >
    )
}