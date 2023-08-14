"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

const HTTP_METHODS: string[] = ["GET"];

export default function FhirQueryForm({
  fhirServerUrl,
  setFhirResponse,
}: {
  fhirServerUrl: string;
  setFhirResponse: any;
}) {
  const [httpMethod, setHttpMethod] = useState<string>(HTTP_METHODS[0]);
  const [query, setQuery] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  console.log(fhirServerUrl);

  function handleHttpMethodSelect(value: string) {
    setHttpMethod(value);
  }
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!query) {
      setError(true);
      return;
    }
    const url = [
      fhirServerUrl.replace(/\/$/, ""),
      query.replace(/^\/+/g, ""),
    ].join("/");

    try {
      new URL(url);
    } catch (e) {
      setError(false);
      console.error(e);
    }

    setFhirResponse({ headers: HEADERS, body: RESULTS, statusCode: 200 });
  }
  return (
    <div className="flex justify-between items-center space-x-2">
      <Select defaultValue={httpMethod} onValueChange={handleHttpMethodSelect}>
        <SelectTrigger className="bg-transparent border-0 w-48 rounded-xl text-pink-500 font-semibold text-lg focus:ring-pink-400">
          <SelectValue placeholder="HTTP Method" />
        </SelectTrigger>
        <SelectContent>
          {HTTP_METHODS.map((method: string) => {
            return (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center space-x-5">
          <div className="flex flex-col w-full">
            {error && (
              <div className="mx-4 my-2 text-red-400">
                Please enter a valid query
              </div>
            )}
            <Input
              className="h-14 p-6 rounded-full text-md text-slate-500 placeholder:text-slate-300 focus-visible:ring-pink-400"
              type="text"
              id="fhir-query-input"
              onChange={(e) => {
                setQuery(e.target.value);
                setError(false);
              }}
              placeholder="type your query here (e.g. /Patient?gender=female)"
            />
          </div>
          <Button
            type="submit"
            className="w-24 rounded-full bg-pink-400 hover:bg-pink-600"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
