"use client"
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { useEffect } from "react";
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    // Remove or replace debug log in production
    // console.log("--", user)
  }, [user])

  return (
    <div>
      <Header/>
      <Hero/>
    </div>
  );
}
