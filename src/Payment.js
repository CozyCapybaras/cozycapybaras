import Home from './Home';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import key from "./serverWallet.json";
import {
    createTransferCheckedInstruction,
    getAssociatedTokenAddress,
    getMint,
    getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import base58 from "bs58";
const web3 = require("@solana/web3.js");
const { Token } = require("@solana/spl-token");
const anchor = require('@project-serum/anchor');

const solanaWeb3 = require('@solana/web3.js');
const lamports_per_sol = solanaWeb3.LAMPORTS_PER_SOL;
var wallet;
//var mintPublicKey = new web3.PublicKey("3BgZAJV8QYBioLadXZsF37CGw5Cy1dsst1WmjWjdZp2s");

export class Payment {
    static async connect() {
        /*
        wallet = window.solana.connect()
        window.solana.on("connect", () => {
            alert("connected! " + window.solana.publicKey.toString());
            wallet = window.solana;
        })
        */
        wallet = await window.solana.connect();
        wallet = window.solana;
    };

    static disconnect = () => {
        window.solana.disconnect()
        window.solana.on("disconnect", () => alert("disconnected!"))
    };

    static getProvider = async () => {
        if ("solana" in window) {
            const provider = window.solana;
            const { solana } = window;

            if (provider.isPhantom) {
                await solana.connect();
                return provider;
            }
        } else {
            window.open("https://www.phantom.app/", "_blank");
        }
    };

    static async buy(cost, number, token) {
        if (wallet == undefined || wallet.isConnected == false) {
            await Payment.connect();
        }

        var mintPublicKey = new web3.PublicKey(token);

        const connection = new web3.Connection(
            web3.clusterApiUrl("devnet"),
            "confirmed"
        );

        console.log("Transaction triggered");
        let seed = Uint8Array.from(key).slice(0, 32);
        var serverWallet = Keypair.fromSeed(seed);
        // cost *= 1000000000;

        //var provider = await Payment.getProvider();
        var provider = wallet;

        const treasueryWallet = serverWallet.publicKey;
        // const connection = new Connection(SOLANA_MAINNET, "confirmed");
        // Establishing connection
        if (cost <= 0) {
            alert("value is 0.");
            return;
        }
        let sol = (cost).toFixed(5);
        try {


            const serverProvider = new anchor.AnchorProvider(
                connection, serverWallet, { preflightCommitment: "processed" },
            );

            const serverAccount = new Token(
                serverProvider.connection,
                mintPublicKey,
                TOKEN_PROGRAM_ID,
                serverWallet.publicKey);
            const serverAccountInfo = await serverAccount.getOrCreateAssociatedAccountInfo(serverWallet.publicKey);
            const serverAccountAddr = serverAccountInfo.address;
            const userAccount = new Token(
                serverProvider.connection,
                mintPublicKey,
                TOKEN_PROGRAM_ID,
                serverWallet.publicKey);



            const userAccountToken = await Token.getAssociatedTokenAddress(
                userAccount.associatedProgramId,
                userAccount.programId,
                mintPublicKey,
                wallet.publicKey
            );
            const userAccountInfo = await connection.getAccountInfo(userAccountToken);
            console.log(wallet);
            var userAccountAddr = userAccountToken;

            //const userAccountInfo = await userAccount.getOrCreateAssociatedAccountInfo(wallet.publicKey);
            //const userAccountAddr = userAccountInfo.address;

            if (userAccountInfo === null) {
                var transaction2 = new Transaction().add(
                    Token.createAssociatedTokenAccountInstruction(
                        userAccount.associatedProgramId,
                        userAccount.programId,
                        mintPublicKey,
                        userAccountAddr,
                        wallet.publicKey,
                        wallet.publicKey
                    )
                );
                transaction2.feePayer = wallet.publicKey;
                transaction2.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
                await wallet.signTransaction(transaction2);
                const transactionSignature = await connection.sendRawTransaction(
                    transaction2.serialize(),
                    { skipPreflight: true }
                );

                await connection.confirmTransaction(transactionSignature);
            }
            var transaction = new Transaction()


            .add(
                SystemProgram.transfer({
                    fromPubkey: provider.publicKey,
                    toPubkey: treasueryWallet,
                    lamports: sol * lamports_per_sol,
                })
            )
            .add(
                Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    serverAccountAddr,
                    userAccountAddr,
                    serverProvider.wallet.publicKey,
                    [],
                    1000000000*number
                )
            );
            console.log(transaction)

            //var transaction = new web3.Transaction().add(...instructions);

            if (transaction) {
                console.log("Txn created successfully");
            }

            // Setting the variables for the transaction
            transaction.feePayer = provider.publicKey;
            let blockhashObj = await connection.getRecentBlockhash();
            transaction.recentBlockhash = await blockhashObj.blockhash;
            // Request creator to sign the transaction (allow the transaction)
            transaction.sign(serverWallet);
            var startTime = new Date();
            let signed = await provider.signTransaction(transaction);
            var endTime = new Date();
            var diff = endTime - startTime
            diff /= 1000;
            if (diff <= 6) {
                // The signature is generated
                let signature = await connection.sendRawTransaction(signed.serialize());
                // Confirm whether the transaction went through or not
                await connection.confirmTransaction(signature);
                

                console.log("ok")
            }
        } catch (err) {
            console.log(err);
        }
        
    };


    static async sell(cost, number, token) {
        if (wallet == undefined || wallet.isConnected == false) {
            await Payment.connect();
        }

        var mintPublicKey = new web3.PublicKey(token);

        const connection = new web3.Connection(
            web3.clusterApiUrl("devnet"),
            "confirmed"
        );

        console.log("Transaction triggered");
        let seed = Uint8Array.from(key).slice(0, 32);
        var serverWallet = Keypair.fromSeed(seed);

        // cost *= 1000000000;

        //var provider = await Payment.getProvider();
        var provider = wallet;

        const treasueryWallet = serverWallet.publicKey;
        // const connection = new Connection(SOLANA_MAINNET, "confirmed");
        // Establishing connection
        if (cost <= 0) {
            alert("value is 0.");
            return;
        }
        let sol = (cost).toFixed(5);
        try {


            const serverProvider = new anchor.AnchorProvider(
                connection, wallet, { preflightCommitment: "processed" },
            );

            const serverAccount = new Token(
                serverProvider.connection,
                mintPublicKey,
                TOKEN_PROGRAM_ID,
                serverWallet.publicKey);
            const serverAccountInfo = await serverAccount.getOrCreateAssociatedAccountInfo(serverWallet.publicKey);
            const serverAccountAddr = serverAccountInfo.address;
            const userAccount = new Token(
                serverProvider.connection,
                mintPublicKey,
                TOKEN_PROGRAM_ID,
                serverWallet.publicKey);
            const userAccountInfo = await userAccount.getOrCreateAssociatedAccountInfo(wallet.publicKey);
            const userAccountAddr = userAccountInfo.address;


            const amount = LAMPORTS_PER_SOL * sol;
            var transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: treasueryWallet,
                    toPubkey: provider.publicKey,
                    lamports: Math.floor(amount),
                })
            ).add(Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                userAccountAddr,
                serverAccountAddr,
                serverProvider.wallet.publicKey,
                [],
                1000000000*number
            )
            );
            if (transaction) {
                console.log("Txn created successfully");
            }
            // Setting the variables for the transaction
            transaction.feePayer = provider.publicKey;
            let blockhashObj = await connection.getRecentBlockhash();
            transaction.recentBlockhash = await blockhashObj.blockhash;
            // Request creator to sign the transaction (allow the transaction)
            transaction.sign(serverWallet);
            var startTime = new Date();
            let signed = await provider.signTransaction(transaction);
            var endTime = new Date();
            var diff = endTime - startTime
            diff /= 1000;
            if (diff <= 6) {
                // The signature is generated
                let signature = await connection.sendRawTransaction(signed.serialize());
                // Confirm whether the transaction went through or not
                await connection.confirmTransaction(signature);

                console.log("ok")
            }
        } catch (err) {
            console.log(err);
        }
        
    };
    static async getTokenBalance(token, callback) {
        if (wallet == undefined || wallet.isConnected == false) {
            Payment.connect();
        }
        else {

            var mintPublicKey = new web3.PublicKey(token);

            const connection = new web3.Connection(
                web3.clusterApiUrl("devnet"),
                "confirmed"
            );

            let seed = Uint8Array.from(key).slice(0, 32);
            var serverWallet = Keypair.fromSeed(seed);

            const serverProvider = new anchor.AnchorProvider(
                connection, wallet, { preflightCommitment: "processed" },
            );

            const userAccount = new Token(
                serverProvider.connection,
                mintPublicKey,
                TOKEN_PROGRAM_ID,
                serverWallet.publicKey);
            const userAccountInfo = await userAccount.getOrCreateAssociatedAccountInfo(wallet.publicKey);
            const userAccountAddr = userAccountInfo.address;

            var tokenBalance = await connection.getTokenAccountBalance(userAccountAddr);
            tokenBalance = tokenBalance.value.amount / lamports_per_sol;
            console.log(tokenBalance);
            callback(tokenBalance);
        }
    }
    static async getSolBalance(price, callback) {
        if (wallet == undefined || wallet.isConnected == false) {
            Payment.connect();
        }
        else {
            const connection = new web3.Connection(
                web3.clusterApiUrl("devnet"),
                "confirmed"
            );

            var solBalance = await connection.getBalance(wallet.publicKey);
            console.log(solBalance / lamports_per_sol);
            callback(price, solBalance / lamports_per_sol);
        }
    }
    


}