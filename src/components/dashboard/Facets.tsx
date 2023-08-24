import groupBy from "lodash.groupby";

import { useEffect, useState } from "react";

import { SectionLoader } from "@/app/loading";
import Placeholder from "../Placholder";
import { TotalCountByType } from "./common";
import {
  resourceQueries,
  QueryDef,
  ResourceQuery,
  isUnconstrainedField,
} from "./search";
import { SquareStackIcon } from "lucide-react";

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
  let result = {
    resourceType,
    filter: { ...filter, totalCount: "?" },
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
    result.filter.totalCount = data.total;

    return result;
  } catch {
    return result;
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
            <div key={i} className="flex flex-col items-start">
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
  resourceCounts,
}: {
  resourceType: string;
  fhirServerUrl: string;
  resourceCounts: TotalCountByType;
}) {
  const [selectedFacets, setSelectedFacets] = useState<
    FacetStatsCardType[] | null
  >();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    let ignore = false;

    if (Object.values(resourceCounts).every((c) => c === 0)) {
      setSelectedFacets(null);
      setLoading(false);
      return;
    }

    const updateAll = async () => {
      // Collect queries for selected resource type
      const queries = resourceQueries
        .filter((f) => f.resourceType === resourceType)
        .map((f) => {
          return {
            fhirServerUrl,
            ...f,
          };
        });

      // Fetch results of all queries
      const results: ResourceQuery[] = await Promise.all(
        queries.map((q) =>
          fetchTotal(q.fhirServerUrl, q.resourceType, q.filter)
        )
      );
      // Reformat query results into input for facet cards
      const facetSearchResults: FacetStatsCardType[] =
        reformatResourceQueries(results);

      // For fields that have a variable set of values, compute the total count
      // of all values that are not one of the specific values we query for
      const enhanced: FacetStatsCardType[] = facetSearchResults.map((r) => {
        const recomputeTotal = isUnconstrainedField(resourceType, r.name!);

        if (recomputeTotal) {
          const total = r.filters
            .map((f) => f.totalCount as number)
            .reduce((a, b) => a + b);
          const everythingElseTotal = resourceCounts[resourceType] - total;

          return {
            ...r,
            filters: [
              ...r.filters,
              {
                name: r.name!,
                value: "[ everything else ]",
                icon: (
                  <div className="pr-2">
                    <SquareStackIcon />
                  </div>
                ),
                totalCount: everythingElseTotal,
              },
            ],
          };
        } else {
          return r;
        }
      });

      setSelectedFacets(enhanced);
      setLoading(false);
    };
    if (!ignore) {
      updateAll();
      ignore = true;
    }
  }, [resourceType, resourceCounts, fhirServerUrl]);

  if (loading) {
    return <SectionLoader />;
  }

  if (!selectedFacets || selectedFacets.length === 0) {
    return (
      <div className="p-10 space-y-4">
        <div className="flex items-center justify-center font-light text-lg text-slate-400">
          No data for this resource type
        </div>
        <Placeholder />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg text-slate-500 font-light">Facets</h1>
      <div className="flex flex-wrap gap-6">
        {selectedFacets.map((f, i) => (
          <FacetStatsCard key={i} facet={f} />
        ))}
      </div>
    </div>
  );
}
