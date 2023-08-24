import uniqBy from "lodash.uniqby";

import {
  BanIcon,
  CheckIcon,
  ShieldQuestionIcon,
  User2Icon,
} from "lucide-react";
import * as Icons from "../icon";

export type QueryDef = {
  name: string;
  value: string;
  display?: {
    name?: string;
    value?: string;
  };
  totalCount?: string | number;
  icon?: JSX.Element;
};

export type ResourceQuery = {
  resourceType: string;
  filter: QueryDef;
  unconstrained?: boolean;
};

export type ResourceQueryGroup = {
  resourceType: string;
  filters: QueryDef[];
  name?: string;
  unconstrained?: string[];
};

type FilterInputs = ([value: string, icon?: JSX.Element] | string)[];

function generateFilters(
  name: string,
  filterInputs: FilterInputs,
  defaultIcon?: JSX.Element
): QueryDef[] {
  return filterInputs.map((f) => {
    let value;
    let icon;
    if (typeof f === "string") {
      value = f;
    } else {
      value = f[0];
      icon = f[1];
    }
    return {
      name: name,
      value: value,
      icon: icon || defaultIcon || undefined,
    };
  });
}

const _queries: ResourceQueryGroup[] = [
  {
    resourceType: "ResearchStudy",
    filters: generateFilters("status", [
      "active",
      "administratively-completed",
      "approved",
      "closed-to-accrual",
      "closed-to-accrual-and-intervention",
      "completed",
      "disapproved",
      "in-review",
      "temporarily-closed-to-accrual",
      "temporarily-closed-to-accrual-and-intervention",
      "withdrawn",
    ]),
  },
  {
    resourceType: "Patient",
    filters: [
      {
        name: "gender",
        value: "female",
        icon: <Icons.WomanIcon />,
      },
      {
        name: "gender",
        value: "male",
        icon: <Icons.ManIcon />,
      },
      {
        name: "gender",
        value: "other",
        icon: (
          <div className="pr-2">
            <User2Icon />
          </div>
        ),
      },
      {
        name: "gender",
        value: "unknown",
        icon: (
          <div className="pr-2">
            <ShieldQuestionIcon />
          </div>
        ),
      },
    ],
  },
  {
    resourceType: "Patient",
    filters: [
      {
        name: "active",
        value: "true",
      },
      {
        name: "active",
        value: "false",
      },
    ],
  },
  {
    resourceType: "Specimen",
    unconstrained: ["type"],
    filters: [
      {
        name: "type:text",
        display: {
          name: "type",
        },
        value: "Peripheral Whole Blood",
        icon: <Icons.SpecimenIcon />,
      },
      {
        name: "type:text",
        value: "Saliva",
        display: {
          name: "type",
        },
        icon: <Icons.SpecimenIcon />,
      },
      {
        name: "type:text",
        value: "DNA",
        display: {
          name: "type",
          value: "DNA Extract",
        },
        icon: <Icons.DnaIcon />,
      },
      {
        name: "type:text",
        value: "RNA",
        display: {
          name: "type",
          value: "RNA Extract",
        },
        icon: <Icons.DnaIcon />,
      },
      {
        name: "status",
        value: "available",
        icon: (
          <div className="pr-2">
            <CheckIcon />
          </div>
        ),
      },
      {
        name: "status",
        value: "unavailable",
        icon: (
          <div className="pr-2">
            <BanIcon />
          </div>
        ),
      },
      {
        name: "status",
        value: "unsatisfactory",
        icon: (
          <div className="pr-2">
            <BanIcon />
          </div>
        ),
      },
      {
        name: "status",
        value: "entered-in-error",
        icon: (
          <div className="pr-2">
            <BanIcon />
          </div>
        ),
      },
    ],
  },
  {
    resourceType: "Condition",
    filters: generateFilters("clinical-status", [
      "active",
      "recurrence",
      "relapse",
      "inactive",
      "remission",
      "resolved",
    ]),
  },
  {
    resourceType: "Condition",
    filters: generateFilters("verification-status", [
      "unconfirmed",
      "provisional",
      "differential",
      "confirmed",
      "refuted",
      "entered-in-error",
    ]),
  },
  {
    resourceType: "Observation",
    filters: generateFilters("status", [
      "registered",
      "preliminary",
      "final",
      "amended",
    ]),
  },
  {
    resourceType: "DocumentReference",
    filters: generateFilters("status", [
      "current",
      "superseded",
      "entered-in-error",
    ]),
  },
];

// Make sure we have no duplicate queries
const uniqueQueries: ResourceQuery[] = uniqBy(
  _queries
    .map((facet) => {
      return facet.filters.map((f) => ({
        resourceType: facet.resourceType,
        unconstrained: facet.unconstrained?.includes(f.name.split(":")[0]),
        filter: f,
      }));
    })
    .flat(),
  (q) => `${q.resourceType}${q.filter.name}${q.filter.value}`
);

// Query for resource's <field>=null
const nullQueries: ResourceQuery[] = uniqBy(
  uniqueQueries,
  (q) => `${q.resourceType}${q.filter.name.split(":")[0]}`
).map((q) => {
  const name = q.filter.name.split(":")[0];
  return {
    resourceType: q.resourceType,
    unconstrained: q.unconstrained,
    filter: {
      name: `${name}:missing`,
      value: "true",
      display: {
        name,
        value: "null",
      },
      icon: (
        <div className="pr-2">
          <ShieldQuestionIcon />
        </div>
      ),
    },
  };
});

const queries: ResourceQuery[] = [...uniqueQueries, ...nullQueries];

const unconstrainedFieldsByType = Object.fromEntries(
  queries
    .filter((q) => q.unconstrained)
    .map((q) => [
      `${q.resourceType}-${q.filter.name.split(":")[0]}`,
      q.filter.name.split(":")[0],
    ])
);

export function isUnconstrainedField(resourceType: string, name: string) {
  return unconstrainedFieldsByType[`${resourceType}-${name.split(":")[0]}`];
}

export const resourceQueries: ResourceQuery[] = [...queries];
