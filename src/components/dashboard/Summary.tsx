import { useState, useEffect } from "react";

import { ShieldQuestionIcon } from "lucide-react";
import { TotalCountByType, resourceTypes, resourceTypeIcons } from "./common";

type ResourceTotalCardType = {
  resourceType: string;
  totalCount: number | string;
  icon?: any;
  selected: boolean;
  setSelected: any;
};

function ResourceTotalCard({
  selected = false,
  setSelected,
  resourceType,
  totalCount,
  icon,
}: ResourceTotalCardType) {
  const selectedStyles = selected ? "ring-2 ring-pink-400" : "";

  function handleSelected(e: any, resourceType: string) {
    e.preventDefault();
    setSelected(resourceType);
  }
  return (
    <div
      className={`flex items-start bg-white rounded-lg drop-shadow-md px-4 py-6 w-64 transform active:scale-75 transition-transform hover:cursor-pointer ${selectedStyles}`}
      onClick={(e) => handleSelected(e, resourceType)}
    >
      <div className="text-slate-500 h-8 w-8">
        {icon || <ShieldQuestionIcon />}
      </div>
      <div className="flex flex-col items-start">
        <div className="text-slate-500 text-2xl font-bold">{totalCount}</div>
        <div className="text-slate-400 text-sm font-light">{resourceType}</div>
      </div>
    </div>
  );
}
export default function Summary({
  fhirServerUrl,
  setSelectedResourceType,
  selectedResourceType,
  counts,
  setCounts,
}: {
  fhirServerUrl: string;
  setSelectedResourceType: any;
  selectedResourceType: string;
  counts: TotalCountByType;
  setCounts: any;
}) {
  const [lastUpdated, setLastUpdated] = useState<string>("Unknown");

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
        const d = new Date(dates.pop());

        setLastUpdated(`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`);
      }
    };
    if (!ignore) {
      updateAll();
      ignore = true;
    }
  }, [fhirServerUrl, setCounts]);

  return (
    <div className="flex flex-col">
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
    </div>
  );
}
