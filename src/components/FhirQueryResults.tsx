import { useState } from "react";
import JsonView from "react18-json-view";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Placeholder from "./Placholder";

function displayHeaders(headers: any) {
  // Parse response headers and display
  return headers.map(([key, value]: string[]) => {
    return (
      <div key={key} className="flex">
        <div className="text-blue-400 capitalize">{key + ": "}</div>
        <div>{value}</div>
      </div>
    );
  });
}

export default function FhirQueryResults({
  headers,
  data,
  statusCode,
}: {
  headers: any;
  data: any;
  statusCode: number | null;
}) {
  const [isHeadersOpen, setIsHeadersOpen] = useState(false);
  const [isBodyOpen, setIsBodyOpen] = useState(true);

  return !data ? (
    <Placeholder />
  ) : (
    <div className="flex flex-col space-y-4">
      {/* Response Headers */}
      <Collapsible
        open={isHeadersOpen}
        onOpenChange={setIsHeadersOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-9 p-0 text-slate-500"
              >
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <h3 className="px-2 text-sm text-slate-400 font-light">
              Response Headers
            </h3>
          </div>
          {!!statusCode && (
            <h3 className="px-2 text-sm text-slate-400 font-light">
              HTTP Status Code <span>{statusCode}</span>
            </h3>
          )}
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="w-full h-48 overflow-scroll p-4 bg-white rounded-xl text-sm text-slate-500">
            <pre>{!!headers && displayHeaders(headers)}</pre>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Response Body */}
      <Collapsible
        open={isBodyOpen}
        onOpenChange={setIsBodyOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-9 p-0 text-slate-500"
              >
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <h3 className="px-2 text-sm text-slate-400 font-light">
              Response Body
            </h3>
          </div>
          <h3 className="mx-2 text-sm text-slate-400 font-light">
            Count:{" "}
            <span>
              {typeof data.total === "number" ? data.total : "unknown"}
            </span>
          </h3>
        </div>
        <CollapsibleContent className="space-y-2">
          {!!data && (
            <div className="w-full h-[36rem] overflow-scroll p-2 rounded-xl text-slate-500">
              <div className="text-[16px] rounded-lg p-4 bg-[#2b3f4f]">
                {typeof data === "object" ? (
                  <JsonView
                    collapseObjectsAfterLength={500}
                    collapseStringsAfterLength={10000}
                    src={data}
                  />
                ) : (
                  <div className="text-white">{data}</div>
                )}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
