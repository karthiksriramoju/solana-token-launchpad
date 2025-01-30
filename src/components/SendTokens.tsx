import { useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import SelectWallet from "./SelectWallet";

const SendTokens = () => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const wallet = useWallet();
  const { connection } = useConnection();



  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value);
  };

  async function transferTokens() {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }

      const transaction = new Transaction();
      transaction.add(SystemProgram.transfer({
          fromPubkey: wallet.publicKey!,
          toPubkey: new PublicKey(to),
          lamports: Number(amount) * LAMPORTS_PER_SOL,
      }));

      await wallet.sendTransaction(transaction, connection);
      toast.success("Sent " + amount + " SOL to " + to);
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl p-8 rounded-xl ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Transfer Tokens</h1>
        <label className="block mb-2 font-medium text-md text-gray-700">Recipient Address</label>
        <input
          type="text"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"          value={to}
          onChange={handleChange}
        />
        <label className="block mt-4 mb-2 text-md font-medium text-gray-700">Amount</label>
        <input
          type="text"
          placeholder="Enter amount (SOL)"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-2 focus:ring-gray-500 border border-gray-300 bg-white h-14 placeholder:text-gray-500 p-[15px] mb-3 text-base font-normal leading-normal"          value={amount}
          onChange={handleChange2}
        />
        <button
          type="submit"
          onClick={transferTokens}
          className="w-full bg-gray-700 text-white py-3.5 rounded-lg font-medium hover:bg-gray-950 mt-6"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default SendTokens;
