import BN from 'bn.js' // TODO repace with Bignubmer from quickstart
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


export function init_routes() {
    global.app.post("/request/", async (req, res) => {
        let { zx_address, amount } = req.body;
        // TODO validate amount and address, check token balance (for enouth) and balance for fees
        // split code into parts and remove them from view to related modules
        amount = "0x" + parseInt(amount).toString(16);

        const tokenAmountRecipients = [{
            tokenAddress: process.env.TOKEN,
            amountString: amount,
            recipientAddress: zx_address,
        }];
        console.log(tokenAmountRecipients);

        const relayer = global.app.get('relayer');
        const progressCallback = (process) => {
            console.log(`Proof generation progress: ${process}`);
        };
        const sendWithPublicWallet = true; // send by own relayer
        const showSenderAddressToRecipient = false;

        const {
            maxFeePerGas,
            maxPriorityFeePerGas
        } = await relayer.provider.getFeeData();
        let gasDetailsSerialized = {
            evmGasType: EVMGasType.Type2,
            gasEstimateString: '0x00', // Always 0, we don't have this yet.
            maxFeePerGasString: maxFeePerGas, // Current gas Max Fee
            maxPriorityFeePerGasString: maxPriorityFeePerGas, // Current gas Max Priority Fee
        }
        const gasEstimateString = await gasEstimateForUnprovenTransfer(
            NetworkName.EthereumGoerli,
            global.app.get('wallet_id'),
            process.env.ENCRYPTION_KEY,
            undefined,
            tokenAmountRecipients,
            [], // nftAmountRecipients
            gasDetailsSerialized,
            undefined,
            sendWithPublicWallet
        ).catch(console.log);
        if (gasEstimateString.error) {
            console.log("Can't estimate gas")
            console.log(gasEstimateString.error)
        };
        console.log("Gas estimated");
        console.log(gasEstimateString);
        gasDetailsSerialized.gasEstimateString = gasEstimateString.gasEstimateString

        let { error } = await generateTransferProof(
            NetworkName.EthereumGoerli,
            global.app.get('wallet_id'),
            process.env.ENCRYPTION_KEY,
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
                global.app.get('wallet_id'),
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
            };

            const deserializedTransaction = deserializeTransaction(
                serializedTransaction.serializedTransaction, undefined, 5)
            if (process.env.WORK_MODE === 'send transaction') {
                let tx = await relayer.sendTransaction(
                    deserializedTransaction);
                console.log("Transaction sended");
            };
            res.sendStatus(204);
        } else {
            console.log(error);
            res.sendStatustatus(500);
        };
    });

    global.app.post("/relay/", async (req, res) => {
        const { deserializedTransaction } = req.body;
        const relayer = global.app.get('relayer');
        if (process.env.WORK_MODE === 'send transaction') {
            let tx = await relayer.sendTransaction(
                deserializedTransaction);
            console.log("Transaction sended");
        };
        res.sendStatus(204);
    });
    console.log("Routes initiated");
};