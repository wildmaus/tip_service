import React, { useContext } from "react"
import { Buffer } from 'buffer';
import { UserContext } from "../context";


export default function ConnectButton() {
    const { user, setUser, wallet } = useContext(UserContext);

    if (user) {
        return;
    }

    const connect = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            .catch((err) => {
                if (err.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            });
        await authenticate(accounts[0]);
        if (localStorage.getItem('accessToken')) {
            setUser(accounts[0])
        }
    };


    async function authenticate(address) {
        try {
            await requestRandom(address)
                .then(message => getSignature(address, message))
                .then(signature => getJwt(address, signature))
        } catch (err) {
            console.error(err)
        }
    }

    async function requestRandom(address) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'address': address }),
        };
        return fetch('http://localhost:8000/token/random/', requestOptions)
            .then(response => response.json())
            .then(data => data.message)
            .catch(console.log);
    }

    async function getSignature(address, message) {
        try {
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [Buffer.from(message, 'utf8').toString('hex'), address]
            });
            return signature
        } catch (err) {
            console.log(err);
        }
    }

    async function getJwt(address, signature) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                { 'address': address, 'signature': signature }
            ),
        };
        return fetch('http://localhost:8000/token/', requestOptions)
            .then(response => response.json())
            .then(data => {
                data.access && localStorage.setItem('accessToken', data.access)
                data.refresh && localStorage.setItem('refreshToken', data.refresh)
                if (wallet) {
                    const requestOptions = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.access}`
                        },
                        body: JSON.stringify(
                            { 'railgun_address': wallet.railgunWalletInfo.railgunAddress }
                        ),
                    };
                    fetch('http://localhost:8000/users/me/', requestOptions)
                }
            })
            .catch(console.log);
    }

    return (
        <button onClick={connect}>Log in via Metamask</button>
    )
}