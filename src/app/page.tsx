"use client";

import { useState, useEffect } from "react";

import { SectionLoader } from "./loading";
import { FhirServer, FhirServerOptions, Header } from "@/components/Header";
import FhirQueryForm from "@/components/FhirQueryForm";
import FhirQueryResults from "@/components/FhirQueryResults";

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
      />
      {/* Query FHIR Server */}
      <section id="workspace">
        <div className="container mx-auto my-10 space-y-4">
          <FhirQueryForm
            setLoading={setLoading}
            fhirServerUrl={new URL(fhirServer.url)}
            setFhirResponse={setFhirResponse}
          />
          {!!loading ? (
            <SectionLoader />
          ) : !!fhirResponse.data ? (
            <FhirQueryResults
              headers={fhirResponse.headers}
              data={fhirResponse.data}
              statusCode={fhirResponse.statusCode}
            />
          ) : (
            <div className="flex flex-col items-center font-light h-96">
              <img
                className="w-1/3 h-auto my-4"
                src="./undraw-question.svg"
                alt="Query Server"
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
