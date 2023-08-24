import { useState } from "react";

import Summary from "./Summary";
import { IResourceTypes, resourceTypes, TotalCountByType } from "./common";
import Facets from "./Facets";

export default function Dashboard({
  fhirServerUrl,
}: {
  fhirServerUrl: string;
}) {
  const [selectedResourceType, setSelectedResourceType] =
    useState<IResourceTypes>("ResearchStudy");
  const [counts, setCounts] = useState<TotalCountByType>(
    Object.fromEntries(resourceTypes.map((rt) => [rt, 0]))
  );

  return (
    <div className="container mx-auto my-12 space-y-4">
      <Summary
        fhirServerUrl={fhirServerUrl}
        selectedResourceType={selectedResourceType}
        setSelectedResourceType={setSelectedResourceType}
        counts={counts}
        setCounts={setCounts}
      />
      <Facets
        fhirServerUrl={fhirServerUrl}
        resourceType={selectedResourceType}
        resourceCounts={counts}
      />
    </div>
  );
}
