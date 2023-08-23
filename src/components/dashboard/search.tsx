import { BanIcon, CheckIcon, ShieldQuestionIcon } from "lucide-react";
import * as Icons from "../icon";

type FilterInputs = ([value: string, icon?: JSX.Element] | string)[];

function generateFilters(
  name: string,
  filterInputs: FilterInputs,
  defaultIcon?: JSX.Element
): FacetFilter[] {
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

export type FacetFilter = {
  name: string;
  value: string;
  display?: {
    name?: string;
    value?: string;
  };
  totalCount?: string | number;
  icon?: JSX.Element;
};
export type FacetType = {
  resourceType: string;
  filters: FacetFilter[];
};

export const facets: FacetType[] = [
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
        value: "unknown",
        icon: (
          <div className="pr-2">
            <ShieldQuestionIcon />
          </div>
        ),
      },
      {
        name: "gender",
        value: "other",
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
      {
        name: "active:missing",
        value: "true",
        display: {
          value: "null",
        },
        icon: (
          <div className="pr-2">
            <ShieldQuestionIcon />
          </div>
        ),
      },
    ],
  },
  {
    resourceType: "Specimen",
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
        name: "type:missing",
        value: "true",
        display: {
          name: "type",
          value: "null",
        },
        icon: (
          <div className="pr-2">
            <ShieldQuestionIcon />
          </div>
        ),
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
      {
        name: "status:missing",
        value: "true",
        display: {
          name: "status",
          value: "null",
        },
        icon: (
          <div className="pr-2">
            <ShieldQuestionIcon />
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
];
