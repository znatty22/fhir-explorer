"use client";

import { useSession } from "next-auth/react";
import { BookmarkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

import { Breadcrumbs, Breadcrumb } from "@/components/Breadcrumbs";

const LINKS: Breadcrumb[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/profile",
    label: "Profile",
  },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="container mx-auto my-8">
      <div className="my-2">
        <Breadcrumbs breadcrumbs={LINKS} />
      </div>
      <div className="bg-white rounded-xl drop-shadow-md p-8 w-full">
        <div className="flex items-center space-x-4 ">
          <Link href="https://myaccount.google.com/">
            <Avatar className="h-50 w-50 ring-2 ring-slate-200 ring-offset-base-100 ring-offset-2 hover:ring-pink-600">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="text-lg text-blue-400 font-light bg-blue-100">
                {(user && user.name![0].toUpperCase()) || "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col justify-center items-start">
            <h3 className="text-blue-500 text-xl normal-case tracking-wide">
              {user?.name}
            </h3>
            <h3 className="text-md text-slate-400">{user?.email}</h3>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="bg-white rounded-xl drop-shadow-md p-8 my-6 w-full">
          <div className="flex items-center space-x-4 text-slate-600">
            <div className="flex flex-col space-y-4 w-full">
              <div className="flex space-x-2">
                <BookmarkIcon className="h-6 w-6" />
                <div>
                  <h3 className="text-lg">Saved Queries</h3>
                  <h3 className="text-md text-slate-300">Coming Soon!</h3>
                </div>
              </div>
              <div className="flex justify-center items-center bg-wiggle">
                <img
                  className="w-1/3 h-auto"
                  src="./undraw-bookmarks.svg"
                  alt="Coming Soon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
