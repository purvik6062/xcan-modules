"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidWallet } from "react-icons/bi";
import {
  FiCopy,
  FiLogOut,
  FiCheck,
} from "react-icons/fi";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount, useEnsName, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { login, authenticated, user, logout, ready, connectWallet } =
    usePrivy();
  const { wallets } = useWallets();
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize the display address calculation to avoid unnecessary re-renders
  const displayAddress = useMemo(() => {
    // Find the first wallet with a matching address from a real wallet provider
    const realWallet = wallets.find(
      (wallet) =>
        wallet.address === address && wallet.walletClientType !== "privy"
    );

    if (realWallet) {
      return realWallet.address;
    } else if (address && isConnected && authenticated) {
      // If we have an address and are connected and authenticated, keep it even if it's a Privy wallet
      return address;
    }
    return null;
  }, [wallets, address, isConnected, authenticated]);

  // Memoize wallet connection status
  const isWalletConnected = useMemo(() => {
    return user?.google || user?.farcaster || displayAddress !== null;
  }, [user?.google, user?.farcaster, displayAddress]);

  // Handle wallet disconnection when not authenticated
  useEffect(() => {
    if (!authenticated && wallets.every((wallet) => wallet.walletClientType === "privy")) {
      wagmiDisconnect();
    }
  }, [authenticated, wallets, wagmiDisconnect]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopyAddress = useCallback(() => {
    if (displayAddress) {
      navigator.clipboard.writeText(displayAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  }, [displayAddress]);

  const truncateAddress = useCallback((addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  const handleLogin = useCallback(async () => {
    if (!authenticated) {
      login();
    } else {
      if (!user?.google && !user?.farcaster) {
        connectWallet();
      }
    }
  }, [authenticated, login, user?.google, user?.farcaster, connectWallet]);

  const handleLogout = useCallback(async () => {
    await logout();
    if (!user?.google && !user?.farcaster) {
      wagmiDisconnect();
    }
    setIsDropdownOpen(false);
  }, [logout, user?.google, user?.farcaster, wagmiDisconnect]);

  return (
    <div className="relative" ref={dropdownRef}>
      {!isWalletConnected || !authenticated ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="flex items-center justify-center 
            bg-gradient-to-br from-blue-500 to-[#4e72b1]
            text-white p-3 sm:px-6 sm:py-3 rounded-full 
            shadow-lg hover:shadow-xl 
            transition-all duration-300 
            group relative overflow-hidden mx-auto cursor-pointer"
        >
          <BiSolidWallet className="sm:mr-2 size-5 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">Connect Wallet</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.button>
      ) : (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center 
              bg-gradient-to-br from-blue-50 to-blue-100 
              text-blue-800 px-4 py-2 rounded-full 
              shadow-md hover:shadow-lg 
              hover:rounded-full
              transition-all duration-300 
              group relative"
          >
            <BiSolidWallet className="mr-2 size-6 text-blue-600 group-hover:rotate-6 transition-transform" />
            <span className="font-medium">
              {displayAddress && truncateAddress(displayAddress)}
            </span>
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity hover:rounded-full"></div>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white 
                  rounded-xl shadow-2xl ring-2 ring-blue-100 
                  overflow-hidden z-50"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                  <p className="text-sm text-black">Connected as:</p>
                  <p className="font-bold text-blue-800 truncate">
                    {user?.google?.email ||
                      user?.farcaster?.displayName ||
                      ensName ||
                      (displayAddress && truncateAddress(displayAddress))}
                  </p>
                </div>

                <div className="divide-y divide-blue-100">
                  {displayAddress && (
                    <button
                      onClick={handleCopyAddress}
                      className="w-full flex items-center justify-between 
                        px-4 py-3 text-sm text-black 
                        hover:bg-blue-50 transition-colors 
                        group relative cursor-pointer"
                    >
                      <div className="flex items-center">
                        {copiedAddress ? (
                          <FiCheck className="mr-2 size-5 text-green-500" />
                        ) : (
                          <FiCopy className="mr-2 size-5 text-blue-500" />
                        )}
                        {copiedAddress ? "Copied!" : "Copy Address"}
                      </div>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between 
                      px-4 py-3 text-sm text-red-600 
                      hover:bg-red-50 transition-colors 
                      group relative cursor-pointer"
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2 size-5" />
                      Logout
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}