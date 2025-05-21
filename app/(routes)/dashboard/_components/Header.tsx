import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton, useUser, SignUpButton, SignInButton } from "@clerk/nextjs";
import { Search, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

function Header() {
  const { user } = useUser();
  return (
    <div className="flex justify-between items-center w-full bg-white shadow-sm rounded-lg px-6 py-3 mb-4">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="logo" width={36} height={36} />
        <span className="align-baseline font-bold text-lg text-gray-800">Dashboard</span>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex gap-2 items-center border rounded-md px-3 py-1 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
          <Search className="h-4 w-4 text-gray-400"/>
          <input type="text" placeholder="Search" className="outline-none bg-transparent text-sm px-1"/>
        </div>
        <Button className="gap-2 flex text-sm h-8 hover:bg-blue-700 bg-blue-600 rounded-md shadow">
          <Send className="h-4 w-4"/> Invite
        </Button>
        {user?.imageUrl ? (
          <Image src={user.imageUrl} alt="user" width={32} height={32} className="rounded-full border-2 border-blue-500" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-300"/>
        )}
        <SignedOut>
          <SignUpButton mode="modal">
            <Button className="ml-2 bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">Register</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button className="ml-2 bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
}

export default Header;