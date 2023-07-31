import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
    getProver,
    setOnBalanceUpdateCallback,
    createRailgunWallet,
    loadWalletByID,
} from '@railgun-community/quickstart';
import { NetworkName } from '@railgun-community/shared-models';
import { BigNumber } from 'ethers';
import { entropyToMnemonic, randomBytes } from 'ethers/lib/utils';
import { Buffer } from 'buffer';
import { initializeRailgun, loadProviders } from '../utils/railgunSetup';
import { UserContext } from '../context';

export default function Railgun({ children }) {
    const [user, setUser] = useState();
    const [railgunWallet, setRailgunWallet] = useState();
    const [balance, setBalance] = useState();

    useEffect(() => {
        const init_engine = async () => {
            const response = initializeRailgun();
            if (response.error) {
                console.error(`Failed to start the Railgun Engine: ${response.error}`);
                return;
            }
            // Note: SnarkJS library is not properly typed.
            try {
                const groth16 = window.snarkjs.groth16;
                getProver().setSnarkJSGroth16(groth16);
            } catch (e) {
                console.error('error while getting the prover', e);
            }

            await loadProviders();
            const savedWalletString = localStorage.getItem('wallet');
            if (savedWalletString) {
                const savedWallet = JSON.parse(savedWalletString);
                if (!savedWallet.encryptionKey || !savedWallet.railgunWalletInfo.id) {
                    return;
                }
                const railgunWallet = await loadWalletByID(
                    savedWallet.encryptionKey,
                    savedWallet.railgunWalletInfo.id,
                    false,
                );
                setRailgunWallet(railgunWallet);
            }
        };
        init_engine();
    }, []);

    const createWallet = useCallback(async () => {
        const mnemonic = entropyToMnemonic(randomBytes(16));

        const creationBlockNumberMap = {
            [NetworkName.EthereumGoerli]: undefined,
        };

        const encryptionKey = Buffer.from(randomBytes(32)).toString('hex');

        const railgunWallet = await createRailgunWallet(
            encryptionKey,
            mnemonic,
            creationBlockNumberMap,
        );
        setRailgunWallet(railgunWallet);
        localStorage.setItem(
            'wallet',
            JSON.stringify({
                encryptionKey,
                ...railgunWallet,
            }),
        );

        const access = localStorage.getItem('accessToken');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                'railgun_address':
                    railgunWallet.railgunWalletInfo.railgunAddress
            }),
        };
        fetch('http://localhost:8000/user/me/', requestOptions);
    }, []);

    useEffect(() => {
        if (!railgunWallet) {
            return;
        }

        const onBalanceUpdateCallback = ({ erc20Amounts }) => {
            const tokenAddress = process.env.REACT_APP_TOKEN.toLowerCase();
            const tokenInfo = erc20Amounts.filter(erc20Amount => erc20Amount.tokenAddress === tokenAddress)
            const balance = tokenInfo.length ?
                BigNumber.from(tokenInfo[0].amountString).toString()
                : '0';
            setBalance(balance);
        };
        setOnBalanceUpdateCallback(onBalanceUpdateCallback);

    }, [railgunWallet]);

    const value = useMemo(() => {
        return {
            user: user,
            setUser: setUser,
            createWallet: createWallet,
            wallet: railgunWallet,
            balance: balance,
        }
    }, [user, railgunWallet, balance, createWallet])

    return (
        <>
            <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
        </>
    )
}