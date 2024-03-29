"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import Logo from "./Logo";
import MainMenu from "./MainMenu";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 py-6 bg-white drop-shadow-md z-10">
      <div className="container mx-auto flex flex-row items-center justify-between">
        {/* Left side - title */}
        <Link href="/">
          <div className="flex flex-row items-center space-x-5">
            <div className="rounded-full p-2 ring-2 ring-blue-400 flex justify-center items-center">
              {/* Logo */}
              <div className="h-6 w-6">
                <Logo className="fill-blue-400" />
              </div>
            </div>
            <h1 className="text-xl text-blue-400 font-semibold tracking-wide">
              D3b FHIR Explorer
            </h1>
          </div>
        </Link>
        {/* Right side - avatar menu */}
        <div className="flex items-center space-x-2">
          <MainMenu user={session?.user} />
        </div>
      </div>
    </header>
  );
}
