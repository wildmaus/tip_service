import fs from 'fs'
import path from 'path'
import { groth16 } from 'snarkjs';
import { Level } from "level";
import {
    startRailgunEngine,
    getProver,
    loadProvider,
    setLoggers
} from '@railgun-community/quickstart';
import { NetworkName } from '@railgun-community/shared-models';
import { artifactStore } from './artifact_store.js';
import { init_railgun_wallet } from './railgun_wallet.js';
import { init_routes } from './routes_config.js'
import { init_relayer } from './relayer.js';


const filePath = path.join(path.resolve(), 'logs.txt');
fs.writeFileSync(filePath, "");
const logMessage = (text) => {
    fs.appendFileSync(filePath, text + "\n")
};
const logError = (text) => {
    fs.appendFileSync(filePath, text + "\n")
};

const GOERLI_PROVIDERS = {
    "chainId": 5,
    "providers": [
        {
            "provider": "https://ethereum-goerli.publicnode.com",
            "priority": 1,
            "weight": 1
        },
        {
            "provider": "https://goerli.blockpi.network/v1/rpc/public",
            "priority": 2,
            "weight": 1
        }
    ]
};

const shouldDebug = true;

const initialize_engine = () => {
    setLoggers(logMessage, logError);
    // Name for your wallet implementation.
    // Encrypted and viewable in private transaction history.
    // Maximum of 16 characters, lowercase.
    const walletSource = 'quickstart demo';

    // LevelDOWN compatible database for storing encrypted wallets.
    const db = new Level(path.join(path.resolve(), 'data', 'db'));

    // Whether to forward Engine debug logs to Logger.
    const shouldDebug = true;

    // Persistent store for downloading large artifact files.
    // See Quickstart Developer Guide for platform implementations.
    // const artifactStore = ;

    // Whether to download native C++ or web-assembly artifacts.
    // True for mobile. False for nodejs and browser.
    const useNativeArtifacts = false;

    // Whether to skip merkletree syncs and private balance scans. 
    // Only set to TRUE in shield-only applications that don't 
    //  load private wallets or balances.
    const skipMerkletreeScans = false;

    return startRailgunEngine(
        walletSource,
        db,
        shouldDebug,
        artifactStore,
        useNativeArtifacts,
        skipMerkletreeScans,
    );
};



export async function init_railgun() {
    console.log(`Init railgun...`);
    let { error } = initialize_engine();
    if (error) {
        throw error
    };
    console.log(`Engine initialised`);
    getProver().setSnarkJSGroth16(groth16);
    console.log(`Prover loaded`);
    console.log(`Loading Goerli network...`);
    const { feesSerialized } = await loadProvider(
        GOERLI_PROVIDERS,
        NetworkName.EthereumGoerli,
        shouldDebug
    );
    console.log(`Network loaded`);
    global.app.set('feesSerialized', feesSerialized);

    await init_railgun_wallet(app);
    init_relayer();
    init_routes();
    console.log("Railgun ready!");
};



