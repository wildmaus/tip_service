import {
    startRailgunEngine,
    ArtifactStore,
    setLoggers,
    loadProvider,
} from '@railgun-community/quickstart';
import { NetworkName } from '@railgun-community/shared-models'
import { BrowserLevel } from 'browser-level';
import localforage from 'localforage';
import { GOERLI_PROVIDERS } from './networks';


const db = new BrowserLevel('');

const artifactStore = new ArtifactStore(
    async (path) => {
        return localforage.getItem(path);
    },
    async (dir, path, item) => {
        await localforage.setItem(path, item);
    },
    async (path) => (await localforage.getItem(path)) != null,
);

const setLogging = () => {
    const logMessage = console.log;
    const logError = console.error;
    setLoggers(logMessage, logError);
};

const initialize = () => {
    // Name for your wallet implementation.
    // Encrypted and viewable in private transaction history.
    // Maximum of 16 characters, lowercase.
    const walletSource = 'tip service';
    // Whether to forward Engine debug logs to Logger.
    const shouldDebug = true;
    // Whether to download native C++ or web-assembly artifacts.
    // True for mobile. False for nodejs and browser.
    const useNativeArtifacts = false;
    // Whether to skip merkletree syncs and private balance scans. 
    // Only set to TRUE in shield-only applications that don't 
    //  load private wallets or balances.
    const skipMerkletreeScans = false;

    setLogging();

    return startRailgunEngine(
        walletSource,
        db,
        shouldDebug,
        artifactStore,
        useNativeArtifacts,
        skipMerkletreeScans,
    );
};

export const initializeRailgun = initialize;

export const loadProviders = async () => {
    const shouldDebug = true;
    await loadProvider(
        GOERLI_PROVIDERS,
        NetworkName.EthereumGoerli,
        shouldDebug,
    );
} 