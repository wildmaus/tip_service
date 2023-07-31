import React, { useContext } from 'react';
import Authenticate from "../pages/Authenticate";
import { UserContext } from "../../context";
import './UserInfo.css';

export default function UserInfo() {
    const { user, setUser, wallet, balance } = useContext(UserContext);

    const logOut = async () => {
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser();
    }

    if (!user || !wallet) return (
        <div className={'user-info__login'}>
            <Authenticate />
        </div>
    );

    return (
        <div className={'user-info'}>
            <span>User: {user}</span>
            <span>Zk address: {wallet.railgunWalletInfo.railgunAddress}</span>
            <span>Balance: {balance} TEST</span>
            <button onClick={logOut}>Log out</button>
        </div>
    );
}