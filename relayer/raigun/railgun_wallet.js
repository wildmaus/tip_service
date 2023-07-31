import {
    createRailgunWallet,
    refreshRailgunBalances,
    setOnBalanceUpdateCallback,
    setOnMerkletreeScanCallback
} from '@railgun-community/quickstart';
import { NETWORK_CONFIG, NetworkName } from '@railgun-community/shared-models';


const creationBlockNumberMap = {
    [NetworkName.EthereumGoerli]: process.env.CREATION_BLOCK_NUMBER,
}

// const onMerkletreeScanCallback = ({
//     chain,
//     scanStatus,
//     progress,
// }) => {
//     if (scanStatus === "Complete") {
//         console.log(`Update ${scanStatus}`)
//     } else {
//         console.log(`Progress ${progress}%`)
//     }
// };

const onBalanceUpdateCallback = ({ erc20Amounts }) => {
    global.app.set("tokens_balance", erc20Amounts);
}

export async function init_railgun_wallet() {
    // setOnMerkletreeScanCallback(onMerkletreeScanCallback);
    setOnBalanceUpdateCallback(onBalanceUpdateCallback);
    console.log('Importing wallet...')
    const { railgunWalletInfo } = await createRailgunWallet(
        process.env.ENCRYPTION_KEY,
        process.env.MNEMONIC,
        creationBlockNumberMap,
    );
    global.app.set('wallet_id', railgunWalletInfo.id);
    console.log('Wallet imported')
    // TODO add shield transaction if in env flag = true

    // console.log('Update balances...');
    // const { error } = await refreshRailgunBalances(
    //     NETWORK_CONFIG[NetworkName.EthereumGoerli], 
    // railgunWalletInfo.id, 
    // true
    // );
    // if (error) {
    //     throw error
    // }
    // console.log("Balance updated");
}