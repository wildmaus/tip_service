import React, { useState, useContext } from "react";
import { UserContext } from "../../../../context";
import SendForm from "./SendForm";
import generateTipTransaction from "../../../../utils/generateTipTransaction";


export default function WorkerItem({ worker }) {
    const { wallet } = useContext(UserContext);
    const [showDrop, setShowDrop] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState();

    const sendTip = async (amount) => {
        setIsSubmitting(true);
        setSuccess(undefined);
        let tx;
        try {
            tx = await generateTipTransaction(
                worker.railgun_address,
                amount,
                wallet
            )
        } catch (err) {
            setIsSubmitting(false);
            setSuccess(false);
            return null;
        }
        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({ 'deserializedTransaction': tx }),
        };
        fetch('http://localhost:8080/relay/', requestOptions)
            .then(response => response.ok)
            .then(status => status && setSuccess(true))
            .then(setIsSubmitting(false))
            .catch(() => { setIsSubmitting(false); setSuccess(false) });
    }

    return (
        <li>
            <div>
                <p>
                    {worker.first_name} {worker.last_name}
                    <button disabled={isSubmitting}
                        onClick={() => {
                            setShowDrop(!showDrop);
                            setSuccess(undefined);
                        }}>
                        {showDrop ? 'Cancel' : 'Tip'}
                    </button>
                </p>
                {showDrop && (
                    <>
                        < SendForm sendTip={sendTip} disabled={isSubmitting} />
                        {isSubmitting && <p>Processing transaction...</p>}
                        {
                            success &&
                            <p style={{ color: "green" }}>
                                Successfully submit transaction
                            </p>
                        }
                        {
                            success === false &&
                            <p style={{ color: "red" }}>
                                Something went wrong, lease try again
                            </p>
                        }
                    </>
                )}
            </div>
        </li >
    )
}