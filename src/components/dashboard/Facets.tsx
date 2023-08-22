import { useEffect, useState } from "react";

import { facets, FacetType } from "./search";

async function fetchTotal(
  fhirServerUrl: string,
  resourceType: string,
  filter: { name: string; value: string | number }
) {
  return {
    resourceType,
    filter: {
      name: filter.name,
      value: filter.value,
    },
    total: 10,
  };

  try {
    const resp = await fetch("/api/fhir", {
      method: "POST",
      body: JSON.stringify({
        fhirServerUrl,
        fhirQuery: `/${resourceType}?${filter.name}=${filter.value}&_summary=count`,
      }),
    });
    const data = await resp.json();
    return {
      resourceType,
      filter: {
        name: filter.name,
        value: filter.value,
      },
      total: data.total,
    };
  } catch {
    return {
      resourceType,
      filter: {
        name: filter.name,
        value: filter.value,
      },
      total: "?",
    };
  }
}

function FacetStatsCard({ facet }: { facet: FacetType }) {
  return (
    <div className="flex flex-col items-start bg-white rounded-lg drop-shadow-md px-4 py-6 w-64 space-y-4">
      <h1 className="text-lg font-semibold text-slate-500 capitalize">
        {facet.filters[0].name}
      </h1>
      <div className="flex items-center space-x-8 font-light text-slate-500">
        {facet.filters.map((f, i) => {
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="flex items-center">
                {!!f.icon && f.icon}
                <div className="text-xl font-semibold">
                  {f.totalCount || "?"}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-slate-400 text-sm">{f.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Facets({
  resourceType,
  fhirServerUrl,
}: {
  resourceType: string;
  fhirServerUrl: string;
}) {
  const initFacets: FacetType[] = facets.filter(
    (f) => f.resourceType === resourceType
  );
  const [selectedFacets, setSelectedFacets] = useState<FacetType[]>(initFacets);

  useEffect(() => {
    let ignore = false;
    const updateAll = async () => {
      const results = await Promise.all(
        facets
          .filter((f) => f.resourceType === resourceType)
          .map((facet) => {
            return facet.filters.map((f) =>
              fetchTotal(fhirServerUrl, resourceType, f)
            );
          })
      );
      // Todo
      // use lodash._groupby to group results by facet.filters.name
      // setSelectedFacets(grouped)
    };
    if (!ignore) {
      updateAll();
      ignore = true;
    }
  }, [resourceType]);

  return (
    <div className="flex flex-wrap gap-6">
      {selectedFacets.map((f, i) => (
        <FacetStatsCard key={i} facet={f} />
      ))}
    </div>
  );
}
