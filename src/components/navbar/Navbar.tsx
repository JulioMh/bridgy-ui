import { getSession } from "@/lib/session";
import Link from "next/link";
import { WalletsBtn } from "../wallets/WalletsBtn";
import { NavbarBtns } from "./NavbarBtns";
import { GiFlatPawPrint } from "react-icons/gi";

export const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="flex fixed w-screen bg-slate-100 h-20 justify-center items-center">
      <div className="flex-1 flex justify-left items-center">
        <NavbarBtns />
      </div>
      <div className="flex-2 flex ">
        <WalletsBtn />
      </div>
    </nav>
  );
};
