"use client";

import { CopyIcon, ChevronsUpDownIcon } from "lucide-react";

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
export const FHIR_SERVERS: { [key: string]: FhirServer } = {
  kfdev: {
    name: "Kids First DEV FHIR Server",
    url: "https://kf-api-fhir-service-upgrade-dev.kf-strides.org",
  },
  kfqa: {
    name: "Kids First QA FHIR Server",
    url: "https://kf-api-fhir-service-upgrade-qa.kf-strides.org",
  },
  kfprd: {
    name: "Kids First PRD FHIR Server",
    url: "https://kf-api-fhir-service-upgrade.kf-strides.org",
  },
  includedev: {
    name: "INCLUDE DCC DEV FHIR Server",
    url: "https://include-api-fhir-service-upgrade-dev.includedcc.org",
  },
  includeqa: {
    name: "INCLUDE DCC QA FHIR Server",
    url: "https://include-api-fhir-service-upgrade-qa.includedcc.org",
  },
  includeprd: {
    name: "INCLUDE DCC PRD FHIR Server",
    url: "https://include-api-fhir-service-upgrade.includedcc.org",
  },
};

export function Header({
  fhirServer,
  handleServerSelect,
}: {
  fhirServer: FhirServer;
  handleServerSelect: (value: string) => void;
}) {
  return (
    <header className="bg-white py-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* FHIR Server Header */}
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-slate-300 p-2">
                  <ChevronsUpDownIcon className="h-4 w-4 hover:text-blue-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {Object.keys(FHIR_SERVERS).map((serverId: string) => {
                  return (
                    <DropdownMenuItem
                      key={serverId}
                      className="text-slate-500"
                      onClick={() => handleServerSelect(serverId)}
                    >
                      {FHIR_SERVERS[serverId].name}
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
            <Button
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(fhirServer.url)}
            >
              <CopyIcon className="h-4 w-4 text-slate-300 hover:text-blue-400" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
