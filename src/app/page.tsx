"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

import Navbar from "@/components/Navbar";
import { CopyIcon } from "lucide-react";

import { useState } from "react";

type FhirServer = {
  name: string;
  url: string;
};
const FHIR_SERVERS: { [key: string]: FhirServer } = {
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

export default function Home() {
  const [fhirServer, setFhirServer] = useState<FhirServer>(FHIR_SERVERS.kfprd);

  function handleServerSelect(value: string) {
    console.log(value);
    setFhirServer(FHIR_SERVERS[value]);
  }

  return (
    <div className="bg-slate-50">
      <Navbar />
      <main>
        <header>
          <div className="container mx-auto my-10">
            <div className="flex items-center justify-between">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl text-blue-400 text-md font-light">
                          {fhirServer.name}
                        </h3>
                        <Button variant="ghost">
                          <CopyIcon className="h-4 w-4 text-slate-300 hover:text-blue-400" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{fhirServer.url}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select onValueChange={handleServerSelect}>
                <SelectTrigger className="w-1/4 focus:ring-blue-400">
                  <SelectValue placeholder="Select FHIR Server" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(FHIR_SERVERS).map((serverId: string) => {
                    return (
                      <SelectItem key={serverId} value={serverId}>
                        {FHIR_SERVERS[serverId].name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        <section id="workspace" className="">
          <div className="container mx-auto my-10"></div>
        </section>
      </main>
    </div>
  );
}
