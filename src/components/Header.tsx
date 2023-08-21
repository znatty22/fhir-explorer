import { CopyIcon, FileQuestionIcon, ChevronsUpDownIcon } from "lucide-react";

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
}: {
  fhirServerOptions: FhirServerOptions;
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
            <div className="flex items-center">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className="p-2 hover:rounded-lg hover:bg-slate-50"
                      onClick={() =>
                        navigator.clipboard.writeText(fhirServer.url)
                      }
                    >
                      <CopyIcon className="h-4 w-4 text-slate-300 hover:text-blue-400" />
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
                      <div className="p-2 hover:rounded-lg hover:bg-slate-50">
                        <FileQuestionIcon className="h-4 w-4 text-slate-300 hover:text-blue-400" />
                      </div>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    View FHIR API Docs
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
