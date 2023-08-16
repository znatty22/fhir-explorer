"use client";

import { useState, Suspense } from "react";
import JsonView from "react18-json-view";
import { Loader } from "@/app/loading";

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
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="px-2 text-sm text-slate-400 font-light">
              Response Headers
            </h3>
            {!!statusCode && (
              <h3 className="px-2 text-sm text-slate-400 font-light">
                HTTP Status Code <span>{statusCode}</span>
              </h3>
            )}
          </div>
          <div className="w-full h-48 overflow-scroll p-4 bg-white rounded-xl text-sm text-slate-500">
            <pre>{!!headers && displayHeaders(headers)}</pre>
          </div>
        </div>
        {/* Response Body */}
        <div className="space-y-2">
          <h3 className="px-2 text-sm text-slate-400 font-light">
            Response Body
          </h3>
          {!!data && (
            <div className="w-full h-[36rem] overflow-scroll p-2 rounded-xl text-slate-500">
              <div className="text-[16px] rounded-lg p-4 bg-[#2b3f4f]">
                {typeof data === "object" ? (
                  <JsonView
                    collapseObjectsAfterLength={100}
                    collapseStringsAfterLength={500}
                    src={data}
                  />
                ) : (
                  <div className="text-white">{data}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
