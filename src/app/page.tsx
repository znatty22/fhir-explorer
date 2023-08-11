"use client";

import { useState } from "react";

import { FhirServer, Header, FHIR_SERVERS } from "@/components/Header";
import Navbar from "@/components/Navbar";
import FhirQueryForm from "@/components/FhirQueryForm";
import FhirQueryResults from "@/components/FhirQueryResults";

export default function Home() {
  const [fhirServer, setFhirServer] = useState<FhirServer>(FHIR_SERVERS.kfprd);

  function handleServerSelect(serverId: string) {
    setFhirServer(FHIR_SERVERS[serverId]);
  }

  return (
    <div className="bg-slate-50">
      <Navbar />
      <main>
        {/* Select FHIR Server */}
        <Header
          fhirServer={fhirServer}
          handleServerSelect={handleServerSelect}
        />
        {/* Query FHIR Server */}
        <section id="workspace">
          <div className="container mx-auto my-10 space-y-8">
            <FhirQueryForm fhirServerUrl={fhirServer.url} />
            <FhirQueryResults />
          </div>
        </section>
      </main>
    </div>
  );
}
