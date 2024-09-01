"use client";

import "./wallet.css";
import { SiSolana } from "react-icons/si";
import { useSolanaStore } from "@/lib/store/solana";
import { shortify } from "@/utils/string";
import { useEffect, useRef, useState } from "react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";

export const SolanaBtn = () => {
  const [dropdown, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pubKey, disconnect: disconnectStore } = useSolanaStore();
  const { connect, disconnect, select } = useWallet();
  const wallet = useAnchorWallet();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !(dropdownRef.current as any).contains(event.target) &&
        !(buttonRef.current as any).contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, buttonRef]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdown);
  };

  const connectBtn = async () => {
    try {
      select("Phantom" as WalletName);
      await connect();
    } catch (e) {
      console.log(e);
    }
  };

  const disconnectBtn = () => {
    toggleDropdown();
    disconnect();
    disconnectStore();
  };

  return (
    <div className="flex gap-2 items-center">
      <SiSolana className="text-xl"></SiSolana>
      {pubKey ? (
        <div className="flex flex-col">
          <button onClick={toggleDropdown}>
            {shortify(pubKey.toString())}
          </button>
          {dropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-5 top-9 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <button
                className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={disconnectBtn}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={connectBtn}>
          <span className="font-semibold">Connect</span>
        </button>
      )}
    </div>
  );
};
