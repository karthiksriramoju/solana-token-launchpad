
import RequestAirdrop from './components/RequestAirdrop';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SendTokens from './components/SendTokens';
import CreateToken from './components/CreateToken'
import MainLayout from './components/MainLayout';
import './App.css'

function App() {

  return (
    <>
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
              <Router>
              <MainLayout>
                  <Routes>
                    <Route path="/request-airdrop" element={<RequestAirdrop />} />
                    <Route path="/transfer-tokens" element={<SendTokens />} />
                    <Route path="/create-a-token" element={<CreateToken />} />
                  </Routes>
                </MainLayout>                  
              </Router>
            </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
    <ToastContainer />
  </>
  )
}

export default App
