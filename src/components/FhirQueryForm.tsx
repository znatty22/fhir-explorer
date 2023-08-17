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

const HTTP_METHODS: string[] = ["GET"];

async function getFhirData(fhirServerUrl: URL, fhirQuery: any) {
  return await fetch("/api/fhir", {
    method: "POST",
    body: JSON.stringify({
      fhirServerUrl: String(fhirServerUrl),
      fhirQuery,
    }),
  });
}

export default function FhirQueryForm({
  fhirServerUrl,
  setFhirResponse,
  setLoading,
}: {
  fhirServerUrl: URL;
  setFhirResponse: any;
  setLoading: any;
}) {
  const [httpMethod, setHttpMethod] = useState<string>(HTTP_METHODS[0]);
  const [query, setQuery] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  function handleHttpMethodSelect(value: string) {
    setHttpMethod(value);
  }
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Validate query
    if (!query) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      // Get FHIR data
      const resp = await getFhirData(fhirServerUrl, query);
      const data = await resp.json();

      setFhirResponse({
        headers: [...resp.headers],
        data: data,
        statusCode: resp.status,
      });
    } catch (e) {
      setFhirResponse({
        headers: null,
        data: { error: `Something went wrong querying ${fhirServerUrl}` },
        statusCode: 400,
      });
    }
    setLoading(false);
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
            className="w-24 rounded-full bg-pink-400 hover:bg-pink-600 focus:ring-4 focus:ring-pink-200"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
