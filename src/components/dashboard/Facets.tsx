import groupBy from "lodash.groupby";

import { useEffect, useState } from "react";

import { facets, FacetType, FacetFilter } from "./search";
import { SectionLoader } from "@/app/loading";

type FetchResult = {
  resourceType: string;
  filter: FacetFilter;
  total: number | string;
};
async function fetchTotal(
  fhirServerUrl: string,
  resourceType: string,
  filter: FacetFilter
): Promise<FetchResult> {
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
      filter: { ...filter },
      total: data.total,
    };
  } catch {
    return {
      resourceType,
      filter: {
        ...filter,
      },
      total: "?",
    };
  }
}

function FacetStatsCard({ facet }: { facet: FacetType }) {
  return (
    <div className="space-y-4">
      <h1 className="text-lg text-slate-500 font-light">Facets</h1>
      <div className="flex flex-col items-start bg-white rounded-lg drop-shadow-md px-4 py-6 w-64 space-y-4">
        <h1 className="text-lg font-semibold text-slate-500 capitalize">
          {facet.filters[0].display?.name || facet.filters[0].name}
        </h1>
        <div className="flex flex-col items-start space-y-4 font-light text-slate-500">
          {facet.filters.map((f, i) => {
            return (
              <div key={i} className="flex flex-col items-start space-y-2">
                <div className="flex items-center">
                  {!!f.icon && f.icon}
                  <div className="text-xl font-semibold">
                    {typeof f.totalCount === "number" ? f.totalCount : "?"}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-slate-400 text-sm">
                    {f.display?.value || f.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
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
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFacets, setSelectedFacets] = useState<FacetType[]>(initFacets);

  useEffect(() => {
    setLoading(true);
    let ignore = false;
    const updateAll = async () => {
      const queries = facets
        .filter((f) => f.resourceType === resourceType)
        .map((facet) => {
          return facet.filters.map((f) => ({
            fhirServerUrl,
            resourceType,
            filter: f,
          }));
        })
        .flat();
      const results = await Promise.all(
        queries.map((q) =>
          fetchTotal(q.fhirServerUrl, q.resourceType, q.filter)
        )
      );
      const groupByFilter = groupBy(
        results,
        (facet: FetchResult) => facet.filter.name
      );
      const reformatted = Object.entries(groupByFilter).map(
        ([_, items]: any) => {
          return {
            resourceType: items[0].resourceType,
            filters: items.map((item: any) => {
              return {
                name: item.filter.name,
                value: item.filter.value,
                display: {
                  name: item.filter.display?.name,
                  value: item.filter.display?.value,
                },
                totalCount: item.total,
                icon: item.filter.icon,
              };
            }),
          };
        }
      );
      setSelectedFacets(reformatted);
      setLoading(false);
    };
    if (!ignore) {
      updateAll();
      ignore = true;
    }
  }, [resourceType, fhirServerUrl]);

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="flex flex-wrap gap-6">
      {selectedFacets.map((f, i) => (
        <FacetStatsCard key={i} facet={f} />
      ))}
    </div>
  );
}
