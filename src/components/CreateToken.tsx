import { ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMintToInstruction, getAssociatedTokenAddressSync, getMintLen } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CreateToken = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [signature, setSignature] = useState<string | undefined>(undefined);

    const [tokenImage, setTokenImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [description, setDescription] = useState("");
    const [decimals, setDecimals] = useState("");
    const [supply, setSupply] = useState("");

    const handleImageChange = (e: any) => {

        setTokenImage(e.target.files[0]);
    };

    const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSymbolInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSymbol(event.target.value);
    };

    const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleDecimalsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDecimals(event.target.value);
    };

    const handleSupplyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSupply(event.target.value);
    };

    const handleImageUpload = async () => {
        if (!wallet.publicKey) {
            toast.error("Please connect your wallet first!");
            return;
          }

        if(!name) toast.error("Please enter name");
        if(!symbol) toast.error("Please enter symbol");
        if(!description) toast.error("Please enter description");
        if(!decimals) toast.error("Please enter decimals");
        if(!supply) toast.error("Please enter supply");

        if (!tokenImage) {
            toast.error('Please select an image');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', tokenImage);

        try {
            // Upload image to Pinata
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS ', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': '56beee8eaad7b6bb9d40',
                    'pinata_secret_api_key': '59468f96394c29587a3050cbdcc4e9ea4e9711b6adbe3444d492e15fb215f595',
                },
            });

            const ipfsHash = response.data.IpfsHash;
            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
            
            // Now create a JSON object containing the image URL
            const jsonObject = {
                name: name,
                symbol: symbol,
                description: description,
                image: ipfsUrl,
            };

            // Create a Blob from the JSON object
            const blob = new Blob([JSON.stringify(jsonObject)], { type: 'application/json' });

            // Create a FormData object for the JSON file
            const jsonFormData = new FormData();
            jsonFormData.append('file', blob, 'data.json');

            // Upload JSON file to Pinata
            const jsonResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', jsonFormData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                'pinata_api_key': '56beee8eaad7b6bb9d40',
                'pinata_secret_api_key': '59468f96394c29587a3050cbdcc4e9ea4e9711b6adbe3444d492e15fb215f595',
                },
            });

            const jsonFileHash = jsonResponse.data.IpfsHash;
            const metadataURL = `https://gateway.pinata.cloud/ipfs/${jsonFileHash}`;
            createToken(metadataURL);

        } catch (error) {
            console.error('Error uploading image or JSON:', error);
            alert('Failed to upload image or JSON');
        }
    };

    async function createToken(metadataURL: any) {
        // const revokeMintAuthority = (document.getElementById("revokeMintAuthority") as HTMLInputElement)!.checked;
        // const revokeFreezeAuthority = (document.getElementById("revokeFreezeAuthority") as HTMLInputElement)!.checked;
        // const revokeUpdateAuthority = (document.getElementById("revokeUpdateAuthority") as HTMLInputElement)?.checked;

        const mintKeypair = Keypair.generate();
        const metadata = {
            mint: mintKeypair.publicKey,
            name: name,
            symbol: symbol,
            uri: metadataURL,
            additionalMetadata: [],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey!,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey, Number(decimals), wallet.publicKey!, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey!,
                updateAuthority: wallet.publicKey!,
            }),
        );
        
        const recentBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = recentBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey!;

        transaction.partialSign(mintKeypair);
        let response = await wallet.sendTransaction(transaction, connection);
        setSignature(response);
        
        // token mint address: mintKeypair.publicKey?.toBase58()

        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey!,
            false,
            TOKEN_2022_PROGRAM_ID,
        );

        console.log(associatedToken?.toBase58());

        const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey!,
                associatedToken,
                wallet.publicKey!,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
        );

        await wallet.sendTransaction(transaction2, connection);

        // Calculate total token supply
        const tokenSupply = Number(supply) * Math.pow(10, Number(decimals));

        const transaction3 = new Transaction().add(
            createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey!, Number(tokenSupply), [], TOKEN_2022_PROGRAM_ID)
        );

        await wallet.sendTransaction(transaction3, connection);

        setLoading(false);
        toast.success("Token created and Minted successfully.");
    }

    return (
      <div
          className="relative flex min-h-screen flex-col bg-gray-100 group/design-root overflow-x-hidden"
          style={{ fontFamily: `"Work Sans", "Noto Sans", sans-serif` }}
      >
        
          <div className="layout-container flex h-full grow flex-col">
              <div className="px-40 flex flex-1 justify-center py-5">
            
                  <div className="layout-content-container flex flex-col w-[512px] max-w-[960px] flex-1">
                      <div className="flex flex-wrap justify-between gap-3 p-4">
                          <div className="flex min-w-72 flex-col gap-3">
                              <p className="text-gray-800 tracking-light text-[32px] font-bold leading-tight">
                                  Create Token
                              </p>
                          </div>
                      </div>

                      <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                          <label className="flex flex-col min-w-40 flex-1">
                              <p className="text-gray-700 text-base font-medium leading-normal pb-2">Name</p>
                              <input
                                  placeholder="Name"
                                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                  id="name"
                                  onChange={handleNameInputChange}
                              />
                          </label>

                          <label className="flex flex-col min-w-40 flex-1">
                              <p className="text-gray-700 text-base font-medium leading-normal pb-2">Symbol</p>
                              <input
                                  placeholder="Symbol"
                                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                  id="symbol"
                                  onChange={handleSymbolInputChange}
                              />
                          </label>
                      </div>

                      <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                          <label className="flex flex-col min-w-40 flex-1">
                              <p className="text-gray-700 text-base font-medium leading-normal pb-2">Decimals</p>
                              <input
                                  placeholder="Decimals (ex : 9)"
                                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                  id="decimals"
                                  onChange={handleDecimalsInputChange}
                              />
                          </label>

                          <label className="flex flex-col min-w-40 flex-1">
                              <p className="text-gray-700 text-base font-medium leading-normal pb-2">Supply</p>
                              <input
                                  placeholder="Supply"
                                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                  id="supply"
                                  onChange={handleSupplyInputChange}
                              />
                          </label>
                      </div>

                      <div className="flex flex-col p-4">
                          <p className="text-gray-700 text-base font-medium leading-normal pb-1">Image</p>
                          <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-gray-400 px-6 py-8 bg-gray-200">
                              <p className="text-gray-600 text-sm">
                                  Only PNG images are allowed
                              </p>
                              <input
                                  type="file"
                                  onChange={handleImageChange}
                                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4 bg-gray-700 text-white text-sm font-bold leading-normal tracking-[0.015em] py-1"
                              />
                          </div>
                      </div>

                      <div className="flex flex-wrap items-end gap-4 px-4 py-2">
                          <label className="flex flex-col min-w-40 flex-1">
                              <p className="text-gray-700 text-base font-medium leading-normal pb-2">Description</p>
                              <textarea
                                  placeholder="Description"
                                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white placeholder:text-gray-500 p-[8px] text-base font-normal leading-normal"
                                  id="description"
                                  rows={5}
                                  onChange={handleDescriptionInputChange}
                              />
                          </label>
                      </div>

                      <p className="text-gray-700 px-4">
                          {signature ? `Signature: ${signature}` : null}
                      </p>

                      <div className="flex px-4 justify-end">
                          <button
                            className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-950 mt-3"

                              disabled={loading}
                              onClick={handleImageUpload}
                          >
                              <span className="truncate">
                                  {loading ? 'Please wait...' : 'Create Token'}
                              </span>
                          </button>
                      </div>
                  </div> 
              </div>

          </div>


      </div>
  );
}

export default CreateToken;