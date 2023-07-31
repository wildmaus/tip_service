import React, { useContext } from 'react';
import { UserContext } from '../../context';
import ConnectButton from '../ConnectButton';
import CreateWalletButton from '../CreateWalletButton';


export default function Authenticate() {
    const { user, wallet } = useContext(UserContext);

    if (user && wallet) {
        return;
    }

    return (
        <>
            {!user && <ConnectButton />}
            {user && !wallet && <CreateWalletButton />}
        </>
    );
};

