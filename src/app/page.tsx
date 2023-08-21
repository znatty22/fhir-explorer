"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

import { Loader, LoginLoader } from "./loading";
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

  const { data: session, status } = useSession();
  const [fhirServer, setFhirServer] = useState<FhirServer>(LOCAL_HOST_FHIR);
  const [loading, setLoading] = useState<boolean>(false);
  const [fhirResponse, setFhirResponse] = useState({
    headers: null,
    data: null,
    statusCode: null,
  });

  useEffect(() => {
    if (!session?.user) {
      void signIn("auth0", undefined, { prompt: "login" });
    }
  }, [session]);

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

  return status === "loading" || status === "unauthenticated" ? (
    <LoginLoader />
  ) : (
    <main>
      {/* Select FHIR Server */}
      <Header
        fhirServerOptions={fhirServerOptions}
        fhirServer={fhirServer}
        handleServerSelect={handleServerSelect}
      />
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
