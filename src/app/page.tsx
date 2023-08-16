"use client";

import { useState } from "react";

import { Loader } from "./loading";
import { FhirServer, Header, FHIR_SERVERS } from "@/components/Header";
import FhirQueryForm from "@/components/FhirQueryForm";
import FhirQueryResults from "@/components/FhirQueryResults";

export default function Home() {
  const [fhirServer, setFhirServer] = useState<FhirServer>(FHIR_SERVERS.kfprd);
  const [loading, setLoading] = useState<boolean>(false);
  const [fhirResponse, setFhirResponse] = useState({
    headers: null,
    data: null,
    statusCode: null,
  });

  function handleServerSelect(serverId: string) {
    setFhirServer(FHIR_SERVERS[serverId]);
  }

  return (
    <main>
      {/* Select FHIR Server */}
      <Header fhirServer={fhirServer} handleServerSelect={handleServerSelect} />
      {/* Query FHIR Server */}
      <section id="workspace">
        <div className="container mx-auto my-10 space-y-8">
          <FhirQueryForm
            setLoading={setLoading}
            fhirServerUrl={new URL(fhirServer.url)}
            setFhirResponse={setFhirResponse}
          />
          {!!loading ? (
            <Loader />
          ) : !!fhirResponse.data ? (
            <FhirQueryResults
              headers={fhirResponse.headers}
              data={fhirResponse.data}
              statusCode={fhirResponse.statusCode}
            />
          ) : (
            <div className="flex justify-center items-center font-light text-xl text-slate-400 h-96 border-2 border-dashed ">
              No results to display
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
