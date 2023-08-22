import { ShieldQuestionIcon } from "lucide-react";

export type ResourceTotalCardType = {
  resourceType: string;
  totalCount: number | string;
  icon?: any;
  selected: boolean;
  setSelected: any;
};

export function ResourceTotalCard({
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
      className={`flex items-start bg-white rounded-lg drop-shadow-md px-4 py-6 w-64 hover:cursor-pointer ${selectedStyles}`}
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
