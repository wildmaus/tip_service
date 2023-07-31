import { createContext } from 'react';

export const UserContext = createContext({
    user: undefined,
    setUser: undefined,
    wallet: undefined,
    createWallet: undefined,
    balance: undefined
});
