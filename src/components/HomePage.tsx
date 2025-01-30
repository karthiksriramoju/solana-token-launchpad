import { useNavigate } from 'react-router-dom';


export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path:any) => {
    navigate(path);
  };


  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="text-center py-30 px-6">
        <h1 className="text-6xl font-bold">
          Solana Token <span className="text-purple-500">Launchpad</span>
        </h1>        
        <p className="mt-6 text-xl text-gray-700">
        Airdrop, Launch and Transfer tokens on Solana.
        </p>
        <div className=" mt-10 flex justify-center gap-5flex gap-6">
          <button
            onClick={() => handleNavigation('/request-airdrop')}
            className="px-6 py-3 bg-blue-400 rounded-lg text-md font-semibold hover:bg-blue-600 text-white"
          >
            Airdrop
          </button>
          <button
            onClick={() => handleNavigation('/create-token')}
            className="px-6 py-3 bg-purple-400 rounded-lg text-md font-semibold hover:bg-purple-600 text-white"
          >
            Create Token
          </button>
          <button
            onClick={() => handleNavigation('/transfer-tokens')}
            className="px-6 py-3 bg-gray-600 rounded-lg text-md font-semibold hover:bg-gray-700 text-white"
          >
            Transfer Tokens
          </button>
          </div>
      </header>

      {/* Features Section */}
      <section className=" px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold">What Can You Do?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-300 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Create Token</h3>
            <p className="mt-2 text-gray-600">Easily create your own Solana-based tokens.</p>
          </div>
          <div className="p-6 bg-gray-300 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Airdrop</h3>
            <p className="mt-2 text-gray-600">Get Solana tokens on the Devnet for testing.</p>
          </div>
          <div className="p-6 bg-gray-300 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Transfer Tokens</h3>
            <p className="mt-2 text-gray-600">Transfer Solana tokens to anyone instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
