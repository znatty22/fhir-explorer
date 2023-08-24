import Link from "next/link";

import {
  CopyIcon,
  FileQuestionIcon,
  ChevronsUpDownIcon,
  RouterIcon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export type FhirServer = {
  name: string;
  url: string;
};

export type FhirServerOptions = {
  [key: string]: FhirServer;
};

export function Header({
  fhirServerOptions,
  fhirServer,
  handleServerSelect,
  setView,
}: {
  fhirServerOptions: FhirServerOptions;
  fhirServer: FhirServer;
  handleServerSelect: (value: string) => void;
  setView: (value: string) => void;
}) {
  return (
    <header className="bg-white py-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* FHIR Server Header */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-slate-400 p-2">
                  <ChevronsUpDownIcon className="transform active:scale-75 transition-transform h-4 w-4 hover:text-blue-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {Object.keys(fhirServerOptions).map((serverId: string) => {
                  return (
                    <DropdownMenuItem
                      key={serverId}
                      className="text-slate-500"
                      onClick={() => handleServerSelect(serverId)}
                    >
                      {fhirServerOptions[serverId]?.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <h3 className="text-xl text-blue-400 text-md font-light">
                    {fhirServer.name}
                  </h3>
                </TooltipTrigger>
                <TooltipContent side="bottom">{fhirServer.url}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="bg-slate-50 rounded-xl text-slate-400 flex items-center mx-4 px-2">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className="p-2 transform active:scale-75 transition-transform hover:rounded-lg "
                      onClick={() =>
                        navigator.clipboard.writeText(fhirServer.url)
                      }
                    >
                      <CopyIcon className="h-4 w-4 hover:text-blue-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Copy FHIR URL</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${fhirServer.url}/swagger-ui/`}
                    >
                      <div className="p-2 transform active:scale-75 transition-transform hover:rounded-lg">
                        <FileQuestionIcon className="h-4 w-4 hover:text-blue-400" />
                      </div>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    View FHIR API Docs
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <Link href="/settings">
                      <div className="p-2 transform active:scale-75 transition-transform hover:rounded-lg">
                        <RouterIcon className="h-4 w-4 hover:text-blue-400" />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    View Server Status
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Tabs defaultValue="query">
            <TabsList>
              <TabsTrigger onClick={() => setView("query")} value="query">
                Query
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setView("dashboard")}
                value="dashboard"
              >
                Dashboard
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
}
