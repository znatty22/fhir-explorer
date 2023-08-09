import Navbar from "@/components/Navbar";

type FhirServer = {
  name: string;
  url: string;
  code: string;
};
const FHIR_SERVERS: FhirServer[] = [
  {
    name: "Kids First DEV FHIR Server",
    code: "kf-dev",
    url: "https://kf-api-fhir-service-upgrade-dev.kf-strides.org",
  },
  {
    name: "Kids First QA FHIR Server",
    code: "kf-qa",
    url: "https://kf-api-fhir-service-upgrade-qa.kf-strides.org",
  },
  {
    name: "Kids First PRD FHIR Server",
    code: "kf-prd",
    url: "https://kf-api-fhir-service-upgrade.kf-strides.org",
  },
  {
    name: "INCLUDE DCC DEV FHIR Server",
    code: "include-dev",
    url: "https://include-api-fhir-service-upgrade-dev.includedcc.org",
  },
  {
    name: "INCLUDE DCC QA FHIR Server",
    code: "include-qa",
    url: "https://include-api-fhir-service-upgrade-qa.includedcc.org",
  },
  {
    name: "INCLUDE DCC PRD FHIR Server",
    code: "include-prd",
    url: "https://include-api-fhir-service-upgrade.includedcc.org",
  },
];

export default function Home() {
  return (
    <div className="bg-slate-50">
      <Navbar />
      <main>
        <header>
          <div className="container mx-auto my-10">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-400 text-md font-light">
                Kids First PRD FHIR Server
              </h3>
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
