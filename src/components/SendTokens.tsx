import { useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

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
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-gray-100 shadow-lg">
      <label className="block mb-2 font-medium text-gray-700">Recipient Address</label>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={to}
        onChange={handleChange}
      />
      <label className="block mb-2 font-medium text-gray-700">Amount</label>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={amount}
        onChange={handleChange2}
      />
      <button
        type="submit"
        onClick={transferTokens}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </div>
  );
};

export default SendTokens;
