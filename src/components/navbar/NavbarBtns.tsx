"use client";

import { useSolanaStore } from "@/lib/store/solana";
import { useStellarStore } from "@/lib/store/stellar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiFlatPawPrint } from "react-icons/gi";

export const NavbarBtns = () => {
  const { isAdmin: isSolanaAdmin, pubKey: solanaPubKey } = useSolanaStore();
  const { isAdmin: isStellarAdmin, pubKey: stellarAddress } = useStellarStore();
  const route = useRouter();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdown, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdown);
  };

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

  return (
    <>
      <button className="ml-8 mr-16" onClick={() => route.push("/")}>
        <GiFlatPawPrint className="text-4xl" />
      </button>
      {(stellarAddress || solanaPubKey) && (
        <div className="flex gap-16">
          <Link
            href="/"
            className="cursor-pointer text-purple-600 font-semibold hover:font-bold"
          >
            Bridge
          </Link>{" "}
          <Link
            href="/pools"
            className="cursor-pointer text-purple-600 font-semibold hover:font-bold"
          >
            Your Pools
          </Link>{" "}
          {(isStellarAdmin || isSolanaAdmin) && (
            <div className="flex flex-col">
              <button
                onClick={toggleDropdown}
                ref={buttonRef}
                className="cursor-pointer text-purple-600 font-semibold hover:font-bold"
              >
                Admin
              </button>
              {dropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute left-80 top-11 ml-10 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg"
                >
                  {isSolanaAdmin && (
                    <Link
                      href="/admin/solana"
                      className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Solana
                    </Link>
                  )}
                  {isStellarAdmin && (
                    <Link
                      href="/admin/stellar"
                      className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Stellar
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
