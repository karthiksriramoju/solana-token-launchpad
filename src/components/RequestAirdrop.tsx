import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-toastify";
import SelectWallet from "./SelectWallet";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl p-8 rounded-xl ">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Request SOL Airdrop</h1>
        {wallet.publicKey ? <p className="text-md text-gray-600 mb-6"><strong>Public Address:</strong> {key?.toString()}</p> : null
}
        <label className="block mb-2 text-md font-bold text-gray-700">Enter Amount (SOL):</label>
        <input
          id="airdrop-amount"
          type="text"
          value={amount}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal mb-3"          placeholder="Enter amount (max 2 SOL)"
        />
        <button
          onClick={handleAirdropRequest}
          className="w-full bg-gray-700 text-white py-3.5 rounded-lg font-medium hover:bg-gray-950 mt-4"
        >
          Request Airdrop
        </button>
      </div>
    </div>
  );
};

export default RequestAirdrop;
