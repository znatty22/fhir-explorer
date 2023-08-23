import groupBy from "lodash.groupby";

import { useEffect, useState } from "react";

import { resourceQueries, QueryDef, ResourceQuery } from "./search";
import { SectionLoader } from "@/app/loading";
import Placeholder from "../Placholder";

type FacetStatsCardType = {
  resourceType: string;
  filters: QueryDef[];
  name?: string;
};

function reformatResourceQueries(
  queries: ResourceQuery[]
): FacetStatsCardType[] {
  const groupByFilter = groupBy(
    queries,
    (query: ResourceQuery) => query.filter.name.split(":")[0]
  );
  return Object.entries(groupByFilter).map(([key, items]: any) => {
    return {
      resourceType: items[0].resourceType,
      name: key,
      filters: items.map((item: any) => {
        return {
          ...item.filter,
        };
      }),
    };
  });
}

async function fetchTotal(
  fhirServerUrl: string,
  resourceType: string,
  filter: QueryDef
): Promise<ResourceQuery> {
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
      filter: { ...filter, totalCount: data.total },
    };
  } catch {
    return {
      resourceType,
      filter: {
        ...filter,
        totalCount: "?",
      },
    };
  }
}

function FacetStatsCard({ facet }: { facet: FacetStatsCardType }) {
  return (
    <div className="flex flex-col items-start bg-white rounded-lg drop-shadow-md px-4 py-6 w-64 space-y-4">
      <h1 className="text-lg font-semibold text-slate-500 capitalize">
        {facet.name}
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
  );
}

export default function Facets({
  resourceType,
  fhirServerUrl,
}: {
  resourceType: string;
  fhirServerUrl: string;
}) {
  const [selectedFacets, setSelectedFacets] = useState<
    FacetStatsCardType[] | null
  >();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    let ignore = false;

    const updateAll = async () => {
      const queries = resourceQueries
        .filter((f) => f.resourceType === resourceType)
        .map((f) => {
          return {
            fhirServerUrl,
            ...f,
          };
        });

      const results = await Promise.all(
        queries.map((q) =>
          fetchTotal(q.fhirServerUrl, q.resourceType, q.filter)
        )
      );
      const reformatted = reformatResourceQueries(results);

      setSelectedFacets(reformatted);
      setLoading(false);
    };
    if (!ignore) {
      updateAll();
      ignore = true;
    }
  }, [resourceType, fhirServerUrl]);

  if (loading || !selectedFacets) {
    return <SectionLoader />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg text-slate-500 font-light">Facets</h1>
      {selectedFacets.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {selectedFacets.map((f, i) => (
            <FacetStatsCard key={i} facet={f} />
          ))}
        </div>
      ) : (
        <div className="text-md font-light text-slate-400">
          <p>
            Coming soon - no facets have been configured for this resource type
          </p>
          <Placeholder />
        </div>
      )}
    </div>
  );
}
