
import { SignedIn, SignedOut, UserButton, useUser, SignUpButton, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

function Header() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="logo" width={48} height={48} />
          <span className="font-bold text-xl text-gray-800 tracking-tight">Focusflow</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-2 px-5 rounded-lg shadow transition-all duration-200">
                Register
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-5 rounded-lg ml-2 shadow transition-all duration-200">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <button
              className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-5 rounded-lg ml-2 shadow transition-all duration-200"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Header;