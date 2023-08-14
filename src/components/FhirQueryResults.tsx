"use client";

import JsonView from "react18-json-view";

function displayHeaders(headers: string) {
  // Parse response headers and display
  // Use temporary placeholder for now
  return headers
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, i) => {
      return (
        <div key={i} className="flex">
          <div className="text-blue-400">{line.split(":")[0] + ":"}</div>
          <div>{line.split(":")[1]}</div>
        </div>
      );
    });
}

export default function FhirQueryResults({ response }: any) {
  return (
    /* Response Headers */
    <div className="flex flex-col space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="px-2 text-sm text-slate-400 font-light">
            Response Headers
          </h3>
          {!!response.statusCode && (
            <h3 className="px-2 text-sm text-slate-400 font-light">
              HTTP Status Code <span>{response.statusCode}</span>
            </h3>
          )}
        </div>
        <div className="w-full h-48 overflow-scroll p-4 bg-white rounded-xl text-sm text-slate-500">
          <pre>{!!response.headers && displayHeaders(response.headers)}</pre>
        </div>
      </div>
      {/* Response Body */}
      <div className="space-y-2">
        <h3 className="px-2 text-sm text-slate-400 font-light">
          Response Body
        </h3>
        {!!response.body && (
          <div className="w-full h-[36rem] overflow-scroll p-2 rounded-xl text-slate-500">
            <div className="text-[16px] rounded-lg p-4 bg-[#2b3f4f]">
              <JsonView src={JSON.parse(response.body)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
