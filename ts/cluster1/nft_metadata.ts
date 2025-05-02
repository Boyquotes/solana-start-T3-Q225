import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image =  "https://devnet.irys.xyz/Fj2tzuxTSzVdZ4AUQUw9L5yrrvSuBMprabu7Y9C74SyZ"
        const metadata = {
            name: "Jeff Victory",
            symbol: "JV",
            description: "Jeff winner",
            image: image,
            attributes: [
                {trait_type: 'Cool', value: 'black'},
                {trait_type: 'Man', value: 'victorious'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "?"
                    },
                ]
            },
            creators: []
        };

        const file = createGenericFile(JSON.stringify(metadata), "metadata.json", {contentType: "application/json"});
        const myUri = await umi.uploader.upload([file]);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
