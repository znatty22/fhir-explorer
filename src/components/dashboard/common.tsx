import {
  UserCircle2Icon,
  TestTube2Icon,
  FileTextIcon,
  EyeIcon,
  HeartPulseIcon,
  MicroscopeIcon,
} from "lucide-react";

export const resourceTypeIcons: { [key: string]: React.ReactNode } = {
  ResearchStudy: <MicroscopeIcon />,
  Patient: <UserCircle2Icon />,
  Specimen: <TestTube2Icon />,
  Condition: <HeartPulseIcon />,
  Observation: <EyeIcon />,
  DocumentReference: <FileTextIcon />,
};

export const resourceTypes = [...Object.keys(resourceTypeIcons)] as const;

export type IResourceTypes = typeof resourceTypes[number];

export type TotalCountByType = {
  [key: string]: number;
};
