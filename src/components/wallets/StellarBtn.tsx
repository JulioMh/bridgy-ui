"use client";
import { useEffect, useRef, useState } from "react";
import { isConnected, getPublicKey, isAllowed } from "@stellar/freighter-api";
import { useNotify } from "@/lib/hooks/useNotify";
import { useStellarStore } from "@/lib/store/stellar";
import { shortify } from "@/utils/string";
import { SiStellar } from "react-icons/si";

const StellarBtn = () => {
  const notify = useNotify();
  const [dropdown, setStellarDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pubKey, setPubKey, disconnect } = useStellarStore();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !(dropdownRef.current as any).contains(event.target) &&
        !(buttonRef.current as any).contains(event.target)
      ) {
        setStellarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, buttonRef]);

  const connectStellarWallet = async () => {
    try {
      if (await isConnected()) {
        const pubKey = await getPublicKey();
        if (!pubKey.length)
          notify("info", "Open Freighter and input your password");
        else {
          setPubKey(pubKey);
        }
      } else {
        notify("warning", "Freighter is not connected.");
      }
    } catch (error) {
      notify("error", "Freighter is not connected.");
    }
  };

  const toggleDropdown = () => {
    setStellarDropdownOpen(!dropdown);
  };

  return (
    <div className="flex gap-2 items-center">
      <SiStellar className="text-xl "></SiStellar>
      {pubKey ? (
        <div className="flex flex-col">
          <button onClick={toggleDropdown}>{shortify(pubKey)}</button>
          {dropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-5 top-14 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <button
                className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={disconnect}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={connectStellarWallet}>
          <span className="font-semibold">Connect</span>
        </button>
      )}
    </div>
  );
};

export default StellarBtn;
