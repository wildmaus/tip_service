import React, { useState } from "react";


export default function SendForm({ sendTip, ...inputProps }) {
    const [amount, setAmount] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendTip(amount);
        setAmount('');
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Tip amount
                </label>
                <input
                    {...inputProps}
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input {...inputProps} type="submit" />
            </form>
        </>
    )
}