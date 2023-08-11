"use client";

import ReactJson from "react-json-view";
import { ScrollArea } from "@/components/ui/scroll-area";

const HEADERS = `
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Date: Thu, 10 Aug 2023 23:41:20 GMT
X-Powered-By: Smile CDR 2023.02.R02 FHIR REST Endpoint (R4) (FHIR Server; FHIR 4.0.1/R4; HAPI FHIR 6.4.2)
Content-Type: application/fhir+xml;charset=utf-8
X-Request-ID: KzT3uZ86XEJAQnfS
`;

const RESULTS = `
{
  "resourceType": "Patient",
  "id": "4753",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-06-05T16:18:28.204+00:00",
    "source": "#jTUN5kgrcSpSsfjT",
    "profile": [ "http://hl7.org/fhir/StructureDefinition/Patient" ],
    "tag": [ {
      "system": "https://kf-api-dataservice.kidsfirstdrc.org/studies/",
      "code": "SD_65064P2Z"
    } ]
  },
  "extension": [ {
    "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
    "extension": [ {
      "url": "text",
      "valueString": "Not Reported"
    }, {
      "url": "ombCategory",
      "valueCoding": {
        "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
        "code": "NI",
        "display": "NoInformation"
      }
    } ]
  }, {
    "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
    "extension": [ {
      "url": "text",
      "valueString": "Not Reported"
    } ]
  } ],
  "identifier": [ {
    "use": "official",
    "system": "https://kf-api-dataservice.kidsfirstdrc.org/participants/",
    "value": "PT_TMQWP2F8"
  }, {
    "use": "secondary",
    "system": "https://kf-api-dataservice.kidsfirstdrc.org/participants?external_id=",
    "value": "SSHRR10353_00"
  } ],
  "gender": "female"
}
`;

function displayHeaders() {
  // Parse response headers and display
  // Use temporary placeholder for now
  return HEADERS.split(/\r?\n/)
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
export default function FhirQueryResults() {
  return (
    /* Response Headers */
    <div className="flex flex-col space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="px-2 text-sm text-slate-400 font-light">
            Response Headers
          </h3>
          <h3 className="px-2 text-sm text-slate-400 font-light">
            HTTP Status Code <span>403</span>
          </h3>
        </div>
        <div className="w-full h-48 overflow-scroll p-4 bg-white rounded-xl text-sm text-slate-500">
          <pre>{displayHeaders()}</pre>
        </div>
      </div>
      {/* Response Body */}
      <div className="space-y-2">
        <h3 className="px-2 text-sm text-slate-400 font-light">
          Response Body
        </h3>
        <div className="w-full h-[36rem] overflow-scroll p-2 rounded-xl text-slate-500">
          <div className="text-[16px] rounded-lg p-4 bg-[#2b3f4f]">
            <ReactJson
              src={JSON.parse(RESULTS)}
              indentWidth={2}
              displayDataTypes={false}
              theme="flat"
            />
            <pre className="hidden">
              {JSON.stringify(JSON.parse(RESULTS), null, 2)}
            </pre>
          </div>
          {/*
           */}
        </div>
      </div>
    </div>
  );
}
