import React, { useContext } from "react";
import { UserContext } from "../context";


export default function CreateWalletButton() {
    const { wallet, createWallet } = useContext(UserContext);

    if (wallet) {
        return;
    }

    return (
        <button onClick={createWallet}>Create Railgun wallet</button>
    )
}