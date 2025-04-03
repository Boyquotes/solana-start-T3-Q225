import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("BPby7dRLVhEX5zZjiEaEaRMDrj4AZwHV2JNx19x1TYVj");

// Recipient address
const to = new PublicKey("BB5MeRhwYd9z3v7Z8Pu7qjGqvypcfT8guNKewjcZsSBB");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${fromAta.address.toBase58()}`);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
        console.log(`Your ata is: ${toAta.address.toBase58()}`);
        // Transfer the new token to the "toTokenAccount" we just created
        const txId = await transfer(connection, keypair, fromAta.address, toAta.address, keypair.publicKey, 1000000*1)
        console.log(`Your mint txid: ${txId}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();