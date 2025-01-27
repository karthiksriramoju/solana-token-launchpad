import { useState } from "react"


const SendTokens = () => {
  const [amount , setAmount] = useState()
  const [address, setAddress] = useState()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };




  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-gray-100 shadow-lg">
      <label className="block mb-2 font-medium text-gray-700">Recipient Address</label>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">Amount</label>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </div>

  )
}

export default SendTokens
