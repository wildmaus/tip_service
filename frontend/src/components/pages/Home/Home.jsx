import React, { useContext, useState } from "react";
import { UserContext } from "../../../context";
import Authenticate from "../Authenticate";
import Places from "./Places/Places";
import Workers from "./Workers/Workers";


export default function Home() {
    const { user, wallet } = useContext(UserContext);
    const [byWorkers, setByWorkers] = useState(true);

    const selectPlaces = (event) => {
        event.preventDefault();
        setByWorkers(false);
    }

    const selectWorkers = (event) => {
        event.preventDefault();
        setByWorkers(true);
    }


    return (
        <>
            <h1>Welcome to tip service</h1>
            {(!user || !wallet) && (
                <>
                    <p>Please authenticate</p>
                    <Authenticate />
                </>
            )}
            {user && wallet && (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label>Search by:</label>
                        <div onClick={selectPlaces}>
                            <input type={'radio'} checked={!byWorkers} />
                            <label>By places</label>
                        </div>
                        <div onClick={selectWorkers}>
                            <input type={'radio'} checked={byWorkers} />
                            <label>By workers</label>
                        </div>
                    </div>
                    {byWorkers ? <Workers /> : <Places />}
                </>
            )
            }
        </>
    )
}