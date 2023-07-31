import { ethers } from 'ethers';
import {
    gasEstimateForUnprovenTransfer,
    generateTransferProof,
    populateProvedTransfer
} from '@railgun-community/quickstart';
import {
    NetworkName,
    EVMGasType,
    deserializeTransaction
} from '@railgun-community/shared-models';


export default async function generateTipTransaction(to, amount, wallet) {
    const tokenAmountRecipients = [{
        tokenAddress: process.env.REACT_APP_TOKEN,
        amountString: amount,
        recipientAddress: to,
    }];
    const encryptionKey = JSON.parse(localStorage.getItem('wallet'))['encryptionKey']
    const sendWithPublicWallet = true; // send by own relayer
    const showSenderAddressToRecipient = false;
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const progressCallback = (process) => {
        console.log(`Proof generation progress: ${process}`);
    };
    const {
        maxFeePerGas,
        maxPriorityFeePerGas
    } = await provider.getFeeData();
    let gasDetailsSerialized = {
        evmGasType: EVMGasType.Type2,
        gasEstimateString: '0x00', // Always 0, we don't have this yet.
        maxFeePerGasString: maxFeePerGas, // Current gas Max Fee
        maxPriorityFeePerGasString: maxPriorityFeePerGas, // Current gas Max Priority Fee
    }
    const gasEstimateString = await gasEstimateForUnprovenTransfer(
        NetworkName.EthereumGoerli,
        wallet.railgunWalletInfo.id,
        encryptionKey,
        undefined,
        tokenAmountRecipients,
        [], // nftAmountRecipients
        gasDetailsSerialized,
        undefined,
        sendWithPublicWallet
    );
    if (gasEstimateString.error) {
        console.log("Can't estimate gas")
        throw gasEstimateString.error
    };
    console.log("Gas estimated");
    console.log(gasEstimateString);
    gasDetailsSerialized.gasEstimateString = gasEstimateString.gasEstimateString

    let { error } = await generateTransferProof(
        NetworkName.EthereumGoerli,
        wallet.railgunWalletInfo.id,
        encryptionKey,
        showSenderAddressToRecipient,
        undefined,
        tokenAmountRecipients,
        [], // nftAmountRecipients
        undefined,
        sendWithPublicWallet,
        undefined,
        progressCallback,
    );
    if (!error) {
        console.log("Proof generated successfully");
        let serializedTransaction = await populateProvedTransfer(
            NetworkName.EthereumGoerli,
            wallet.railgunWalletInfo.id,
            showSenderAddressToRecipient,
            undefined,
            tokenAmountRecipients,
            [], // nftAmountRecipients
            undefined,
            sendWithPublicWallet,
            undefined,
            gasDetailsSerialized,
        );
        if (serializedTransaction.error) {
            console.log("Can't populate transaction");
            throw serializedTransaction.error
        };

        return deserializeTransaction(
            serializedTransaction.serializedTransaction, undefined, 5)
    } else {
        throw error;
    }
} 