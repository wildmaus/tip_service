import { getDefaultProvider, Wallet } from 'ethers';

export function init_relayer() {
    const provider = getDefaultProvider(process.env.RPC);
    const wallet = Wallet.fromMnemonic(process.env.MNEMONIC).connect(provider);
    global.app.set('relayer', wallet);
    console.log("Relayer initiated");
}