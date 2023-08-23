import { useState } from "react";

import Summary from "./Summary";
import Facets from "./Facets";

export default function Dashboard({
  fhirServerUrl,
}: {
  fhirServerUrl: string;
}) {
  const [selectedResourceType, setSelectedResourceType] =
    useState<string>("Patient");

  return (
    <div className="container mx-auto my-12 space-y-4">
      <Summary
        fhirServerUrl={fhirServerUrl}
        selectedResourceType={selectedResourceType}
        setSelectedResourceType={setSelectedResourceType}
      />
      <Facets
        fhirServerUrl={fhirServerUrl}
        resourceType={selectedResourceType}
      />
    </div>
  );
}
