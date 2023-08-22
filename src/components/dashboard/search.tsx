import * as Icons from "../icon";

type FacetFilter = {
  name: string;
  value: string;
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
    filters: [
      {
        name: "composition",
        value: "blood",
      },
      {
        name: "composition",
        value: "saliva",
      },
    ],
  },
];
