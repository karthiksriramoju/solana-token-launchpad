import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-toastify";

const RequestAirdrop = () => {
  const [amount, setAmount] = useState("");
  const wallet = useWallet();
  const { connection } = useConnection();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };


  const handleAirdropRequest = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }

    const amountInSol = Number(amount);
    if (isNaN(amountInSol) || amountInSol <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (amountInSol > 2) {
      toast.error("Requested SOL amount cannot exceed 2.");
      return;
    }

    try {
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        amountInSol * LAMPORTS_PER_SOL
      );
      toast.success("Airdrop successful!");
      console.log("Airdrop transaction signature:", signature);
    } catch (error) {
      console.error("Airdrop error:", error);
      toast.error(
        "Airdrop failed. You might have reached your daily limit or the faucet is dry."
      );
    }
  };

  const key = wallet?.publicKey

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Request SOL Airdrop</h1>
      <h2>Public Address : {key?.toString()}</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="airdrop-amount">Enter Amount (SOL):</label>
        <input
          id="airdrop-amount"
          type="text"
          value={amount}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Enter amount (max 2 SOL)"
        />
        <button
          onClick={handleAirdropRequest}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Request Airdrop
        </button>
      </div>
    </div>
  );
};

export default RequestAirdrop;
