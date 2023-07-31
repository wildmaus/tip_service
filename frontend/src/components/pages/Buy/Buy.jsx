import React, { useCallback, useContext, useEffect, useState } from "react";
import Authenticate from "../Authenticate";
import { UserContext } from "../../../context";
import BuyForm from "./BuyForm";


export default function Buy() {
    const { user, wallet } = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const sendTransaction = async (amount) => {
        setIsSubmitting(true);
        setSuccess(false);

        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                'amount': amount,
                'zx_address': wallet.railgunWalletInfo.railgunAddress
            }),
        };
        fetch('http://localhost:8080/request/', requestOptions)
            .then(response => response.ok)
            .then(status => status && setSuccess(true))
            .then(() => setIsSubmitting(false))
            .catch(() => { setIsSubmitting(false); setSuccess(false) })
    };

    if (!user || !wallet) {
        return (
            <>
                <h1>Buy</h1>
                <p>Please authenticate</p>
                <Authenticate />
            </>
        )
    }

    return (
        <>
            <h1>Buy</h1>
            <BuyForm
                sendTransaction={sendTransaction}
                disabled={isSubmitting}
            />
            {isSubmitting && <p>Processing transaction...</p>}
            {
                success &&
                <p style={{ color: "green" }}>Successfully submit transaction</p>
            }
        </>
    )
}