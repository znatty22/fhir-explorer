import { useState, useEffect } from "react";

import {
  UserCircle2Icon,
  TestTube2Icon,
  FileTextIcon,
  EyeIcon,
  HeartPulseIcon,
} from "lucide-react";

import { SectionLoader } from "@/app/loading";
import { ResourceTotalCard } from "./stats";
import Facets from "./Facets";

const resourceTypeIcons: { [key: string]: React.ReactNode } = {
  Patient: <UserCircle2Icon />,
  Specimen: <TestTube2Icon />,
  Condition: <HeartPulseIcon />,
  Observation: <EyeIcon />,
  DocumentReference: <FileTextIcon />,
};
const resourceTypes = Object.keys(resourceTypeIcons);

type TotalCountByType = {
  [key: string]: number;
};

export default function Dashboard({
  fhirServerUrl,
}: {
  fhirServerUrl: string;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>("Unknown");
  const [selectedResourceType, setSelectedResourceType] =
    useState<string>("Patient");
  const [counts, setCounts] = useState<TotalCountByType>(
    Object.fromEntries(resourceTypes.map((rt) => [rt, 0]))
  );

  // Update resource type counts
  useEffect(() => {
    let ignore = false;
    const fetchTotal = async (resourceType: string) => {
      try {
        const resp = await fetch("/api/fhir", {
          method: "POST",
          body: JSON.stringify({
            fhirServerUrl,
            fhirQuery: `/${resourceType}?_summary=count`,
          }),
        });
        const data = await resp.json();
        return {
          resourceType,
          total: data.total,
          lastUpdated: data.meta.lastUpdated,
        };
      } catch {
        return {
          resourceType,
          total: "?",
          lastUpdated: "Unknown",
        };
      }
    };
    const updateAll = async () => {
      const results = await Promise.all(
        resourceTypes.map((rt) => fetchTotal(rt))
      );
      setCounts(
        Object.fromEntries(results.map((r) => [r.resourceType, r.total]))
      );
      const dates = results
        .map((r) => r.lastUpdated)
        .filter((value) => value !== "Unknown");
      if (dates.length > 0) {
        dates.sort(function compare(a, b) {
          const d1 = new Date(a);
          const d2 = new Date(b);
          return (d1 as any) - (d2 as any);
        });
        setLastUpdated(new Date(dates.pop()).toUTCString());
      }
    };
    if (!ignore) {
      updateAll();
      ignore = true;
      setLoading(false);
    }
  }, [fhirServerUrl]);

  if (loading) {
    return <SectionLoader />;
  }
  return (
    <div className="container mx-auto my-12 space-y-4">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-lg text-slate-500 font-light">Summary</h1>
        <h3 className="text-xs text-slate-400 font-light">
          Last Updated: {lastUpdated}
        </h3>
      </div>
      <div className="flex items-center space-x-8">
        {Object.entries(counts).map(([resourceType, total], i) => (
          <ResourceTotalCard
            key={i}
            selected={selectedResourceType === resourceType}
            setSelected={setSelectedResourceType}
            resourceType={resourceType}
            totalCount={total}
            icon={resourceTypeIcons[resourceType]}
          />
        ))}
      </div>
      <h1 className="text-lg text-slate-500 font-light">Facets</h1>
      <Facets
        fhirServerUrl={fhirServerUrl}
        resourceType={selectedResourceType}
      />
    </div>
  );
}
