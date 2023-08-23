import * as Icons from "../icon";

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
        name: "type:text",
        value: "Peripheral Whole Blood",
        display: {
          name: "type",
        },
        icon: <Icons.SpecimenIcon />,
      },
      {
        name: "type:text",
        value: "Saliva Sample",
        display: {
          name: "type",
          value: "Saliva",
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
    ],
  },
];
