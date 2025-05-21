"use client"
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation } from 'convex/react';
import React, { useEffect } from 'react';
import Header from './_components/Header';
import FileList from './_components/FileList';
import AdBanner from './../../_components/AdBanner';
import { useUser } from "@clerk/nextjs";

function Dashboard() {
  const convex = useConvex();
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  useEffect(() => {
    if (user) {
      checkUser();
    }
  }, [user]);

  const checkUser = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      console.error("User or user email is missing.");
      return;
    }
    try {
      const result = await convex.query(api.user.getUser, {
        email: user.primaryEmailAddress.emailAddress
      });
      if (!result?.length) {
        await createUser({
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.primaryEmailAddress.emailAddress,
          image: user.imageUrl || ''
        });
      }
    } catch (error) {
      console.error("Error in checkUser:", error);
    }
  };

  return (
    <div className='p-8'>
      <Header />
      <FileList />
      <AdBanner
        data-ad-slot="4796371341"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default Dashboard;