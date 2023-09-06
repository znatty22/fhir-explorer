"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { SectionLoader } from "./loading";
import { FhirServer, FhirServerOptions, Header } from "@/components/Header";
import FhirQueryForm from "@/components/FhirQueryForm";
import FhirQueryResults from "@/components/FhirQueryResults";
import Dashboard from "@/components/dashboard/Dashboard";

const LOCAL_HOST_FHIR = {
  name: "Localhost FHIR Server",
  url: "http://localhost:8000",
};

export default function Home() {
  const [fhirServerOptions, setFhirServerOptions] = useState<FhirServerOptions>(
    {}
  );

  const [fhirServer, setFhirServer] = useState<FhirServer>(LOCAL_HOST_FHIR);
  const [loading, setLoading] = useState<boolean>(false);
  const [view, setView] = useState<string>("query");
  const [fhirResponse, setFhirResponse] = useState({
    headers: null,
    data: null,
    statusCode: null,
  });

  useEffect(() => {
    const fetchServers = async () => {
      let ignore = false;
      const resp = await fetch("/api/settings");
      const data = await resp.json();

      if (!ignore) {
        setFhirServerOptions(data.settings.fhirServers);
        setFhirServer(data.settings.fhirServers.kf_prd);
        ignore = true;
      }
    };
    fetchServers();
  }, [setFhirServer, setFhirServerOptions]);

  function handleServerSelect(serverId: string) {
    setFhirServer(fhirServerOptions[serverId]);
  }

  return (
    <main>
      {/* Select FHIR Server */}
      <Header
        fhirServerOptions={fhirServerOptions}
        fhirServer={fhirServer}
        handleServerSelect={handleServerSelect}
        setView={setView}
      />
      <Button
        onClick={() => {
          throw new Error("error on frontend");
        }}
      >
        Click me
      </Button>
      {/* Query FHIR Server */}
      {view === "query" ? (
        <section id="workspace">
          <div className="container mx-auto my-10 space-y-4">
            <FhirQueryForm
              setLoading={setLoading}
              fhirServerUrl={new URL(fhirServer.url)}
              setFhirResponse={setFhirResponse}
            />
            {!!loading ? (
              <SectionLoader />
            ) : (
              <FhirQueryResults
                headers={fhirResponse.headers}
                data={fhirResponse.data}
                statusCode={fhirResponse.statusCode}
              />
            )}
          </div>
        </section>
      ) : (
        /* Dashboard */
        <section id="dashboard">
          <Dashboard fhirServerUrl={fhirServer.url} />
        </section>
      )}
    </main>
  );
}
