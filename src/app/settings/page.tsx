"use client";

import { useSession } from "next-auth/react";
import { SettingsIcon } from "lucide-react";

import { Breadcrumbs, Breadcrumb } from "@/components/Breadcrumbs";

const LINKS: Breadcrumb[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  return (
    <div className="container mx-auto my-8">
      <div className="my-2">
        <Breadcrumbs breadcrumbs={LINKS} />
      </div>
      <div className="flex justify-between items-center">
        <div className="bg-white rounded-xl drop-shadow-md p-8 my-6 w-full">
          <div className="flex items-center space-x-4 text-slate-600">
            <div className="flex flex-col space-y-4 w-full">
              <div className="flex space-x-2">
                <SettingsIcon className="h-6 w-6" />
                <div>
                  <h3 className="text-lg">Setup Your FHIR Servers</h3>
                  <h3 className="text-md text-slate-300">Coming Soon!</h3>
                </div>
              </div>
              <div className="flex justify-center items-center bg-wiggle">
                <img
                  className="w-1/3 h-auto"
                  src="./undraw-setup.svg"
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
