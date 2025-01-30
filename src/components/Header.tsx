import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from "@solana/wallet-adapter-react";

import { Link, NavLink } from 'react-router-dom';
import ShowBalance from './ShowBalance';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const wallet = useWallet();


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-[#111418] flex items-center justify-between border-b border-[#293038] px-6 py-3 lg:px-10">
            <Link to="/">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-4">
                        {/* Add your logo here */}
                    </div>
                    <h2 className="text-white text-lg font-bold">LOGO</h2>
                </div>
            </Link>

            <div className="flex items-center lg:hidden gap-4">
                <WalletMultiButton />
                <button onClick={toggleMenu} aria-label="Toggle Menu" className="text-white">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <nav
                className={`absolute top-16 left-0 w-full bg-[#111418] lg:static lg:w-auto lg:flex lg:items-center lg:gap-8 transition-all duration-300 ease-in-out z-50 ${
                    isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 lg:max-h-full lg:opacity-100'
                } overflow-hidden lg:overflow-visible`}
            >
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 p-6 lg:p-0">
                    <NavLink
                        to="/request-airdrop"
                        className={({ isActive }) =>
                            `text-white text-base font-medium transition-all duration-200 hover:underline ${isActive ? 'underline text-silver' : ''}`
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Request Airdrop
                    </NavLink>

                    <NavLink
                        to="/create-token"
                        className={({ isActive }) =>
                            `text-white text-base font-medium transition-all duration-200 hover:underline ${isActive ? 'underline text-silver' : ''}`
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Create Token
                    </NavLink>

                    <NavLink
                        to="/transfer-tokens"
                        className={({ isActive }) =>
                            `text-white text-base font-medium transition-all duration-200 hover:underline ${isActive ? 'underline text-silver' : ''}`
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Transfer Tokens
                    </NavLink>

                    <div className="text-white text-base font-medium">
                        <ShowBalance />
                    </div>
                </div>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
                <WalletMultiButton />
            </div>
        </header>
    );
};

export default Header;
