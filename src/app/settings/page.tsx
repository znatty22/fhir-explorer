"use client";

import { useState, useEffect } from "react";
import { SettingsIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, Breadcrumb } from "@/components/Breadcrumbs";
import { FhirServer } from "@/components/Header";
import { FhirServer as FhirServerConfig } from "@/lib/fhir";
import { SectionLoader } from "../loading";
import Placeholder from "@/components/Placholder";
import { useInterval } from "@/hooks";

const STATUS_INTERVAL_MS = 1000 * 10;

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

type ServerStatus = "operational" | "offline" | "degraded" | "unknown";

type FhirServerWithStatus = FhirServer & {
  status?: ServerStatus;
  lastUpdated?: string;
};

function formatDate(d: Date) {
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

async function fetchServerConfigs(): Promise<{
  fhirServerConfigs: FhirServerConfig[];
  error: boolean;
}> {
  let data;
  let error = false;
  try {
    const resp = await fetch("/api/settings");
    data = await resp.json();
  } catch (e) {
    error = true;
  }

  return {
    error: error || !data.settings.fhirServers,
    fhirServerConfigs: data.settings.fhirServers,
  };
}

async function fetchServerStatus(url: string) {
  let status: ServerStatus = "unknown";
  try {
    const resp = await fetch("/api/status", {
      method: "POST",
      body: JSON.stringify({
        fhirServerUrl: new URL(url),
      }),
    });
    const data = await resp.json();
    if (resp.ok) {
      status = data.status === "OPERATIONAL" ? "operational" : "offline";
    }
  } catch (e) {
    status = "offline";
  }
  return status;
}

function FhirServerWithStatus({
  initFhirServer,
}: {
  initFhirServer: FhirServerWithStatus;
}) {
  const [fhirServer, setFhirServer] =
    useState<FhirServerWithStatus>(initFhirServer);

  async function fetchAndSetServerStatus(url: string) {
    setFhirServer({
      ...fhirServer,
      status: await fetchServerStatus(url),
      lastUpdated: formatDate(new Date()),
    });
  }

  useInterval(
    async () => fetchAndSetServerStatus(fhirServer.url),
    STATUS_INTERVAL_MS
  );

  const statusStyles = {
    operational: "bg-green-100 text-green-600",
    degraded: "bg-yellow-100 text-yellow-600",
    offline: "bg-red-100 text-red-600",
    unknown: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="grid grid-cols-5 gap-4 bg-white rounded-xl drop-shadow-md p-6">
      <h3 className="col-span-1 text-md text-slate-600 font-semibold">
        {fhirServer.name}
      </h3>
      <h3 className="col-span-2 text-sm text-slate-400 text-left font-light">
        {fhirServer.url}
      </h3>
      <h3 className="col-span-1 text-sm text-slate-400 font-light">
        {fhirServer.lastUpdated}
      </h3>
      <div className="col-span-1">
        <Badge
          className={`${
            statusStyles[fhirServer.status || "unknown"]
          } capitalize hover:bg-slate-100 text-left`}
        >
          {fhirServer.status || "unknown"}
        </Badge>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [fhirServers, setFhirServers] = useState<FhirServerWithStatus[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const doWork = async () => {
      let ignore = false;
      const { error, fhirServerConfigs } = await fetchServerConfigs();

      if (error) {
        setError(true);
        return;
      }

      const getServerStatus = async (fhirServerConfig: FhirServerConfig) => {
        return {
          ...fhirServerConfig,
          status: await fetchServerStatus(fhirServerConfig.url),
          lastUpdated: formatDate(new Date()),
        };
      };

      if (!ignore) {
        const result = await Promise.all(
          Object.values(fhirServerConfigs).map((s) => getServerStatus(s))
        );
        setFhirServers(result);
        ignore = true;
      }
    };
    doWork();
  }, []);

  if (!fhirServers) {
    return <SectionLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 my-20">
        <h3 className="text-slate-400 text-lg font-light">
          Something went wrong fetching FHIR servers
        </h3>
        <Placeholder />
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <div className="my-2">
        <Breadcrumbs breadcrumbs={LINKS} />
      </div>
      <div className="flex flex-col my-10 space-y-4">
        <div className="flex items-center text-slate-600 space-x-4">
          <SettingsIcon className="h-6 w-6" />
          <h3 className="text-lg">FHIR Servers</h3>
        </div>
        <p className="text-sm text-slate-400">
          Status updates on page refresh and every {STATUS_INTERVAL_MS / 1000}{" "}
          seconds
        </p>
        <div className="flex flex-col space-y-4">
          {fhirServers.map((server, i) => (
            <FhirServerWithStatus key={i} initFhirServer={server} />
          ))}
        </div>
      </div>
    </div>
  );
}
