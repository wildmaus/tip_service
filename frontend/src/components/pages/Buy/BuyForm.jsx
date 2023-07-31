import React, { useState } from "react";

export default function BuyForm({ sendTransaction, ...inputProps }) {
    const [amount, setAmount] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendTransaction(amount);
        setAmount('');
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Amount to receive
                </label>
                <input
                    {...inputProps}
                    type="text"
                    value={amount}
                    style={{ marginLeft: '8px' }}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input {...inputProps} type="submit" style={{ marginLeft: '8px' }} />
            </form>
        </>
    )
}