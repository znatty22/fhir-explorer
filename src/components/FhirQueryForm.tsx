import { useState } from "react";

import { ChevronRightCircleIcon, ChevronLeftCircleIcon } from "lucide-react";

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

type PaginationDirection = "next" | "previous";
type PaginationLink = {
  url: string;
  relation: PaginationDirection;
};
type FhirApiResponse = {
  headers: [string, string][] | null;
  data: any;
  statusCode: number;
};
type FhirResponseWithPagination = {
  error: string;
  fhirResponse: FhirApiResponse;
  nextUrl: string;
  previousUrl: string;
};

function getPaginationUrl(
  links: PaginationLink[],
  direction: PaginationDirection
): string {
  return (
    links.filter((l: PaginationLink) => l.relation === direction)[0]?.url || ""
  );
}

async function queryFhirWithPagination(
  url: string
): Promise<FhirResponseWithPagination> {
  let error = `Something went wrong querying ${url}`;
  let nextUrl = "";
  let previousUrl = "";
  let fhirResponse;
  let resp;

  try {
    // Get FHIR data
    const urlParts = new URL(url);
    resp = await fetch("/api/fhir", {
      method: "POST",
      body: JSON.stringify({
        fhirServerUrl: new URL(urlParts.origin),
        fhirQuery: urlParts.pathname + urlParts.search,
      }),
    });

    const data = await resp.json();
    if (resp.ok && !!data) {
      error = "";
      fhirResponse = {
        headers: [...resp.headers],
        data: data,
        statusCode: resp.status,
      };
      // Get pagination urls
      nextUrl = getPaginationUrl(data?.link || [], "next");
      previousUrl = getPaginationUrl(data?.link || [], "previous");
    } else {
      error = JSON.stringify(data);
    }
  } catch (e) {
    error = `Something went wrong querying ${url}`;
  }
  if (error || !fhirResponse) {
    fhirResponse = {
      headers: !!resp?.headers ? [...resp.headers] : null,
      data: { error },
      statusCode: 400,
    };
  }

  return {
    error,
    fhirResponse,
    nextUrl,
    previousUrl,
  };
}

function PaginationUI({
  nextUrl,
  previousUrl,
  setNextUrl,
  setPreviousUrl,
  setLoading,
  setFhirResponse,
}: {
  nextUrl: string;
  previousUrl: string;
  setNextUrl: any;
  setPreviousUrl: any;
  setLoading: any;
  setFhirResponse: any;
}) {
  const animateScaleStyles = "transform active:scale-75 transition-transform";
  const btnStyles = `${animateScaleStyles} disabled:text-slate-300 disabled:pointer-events-none hover:cursor-pointer hover:text-blue-400`;

  function updateFhirQueryInput(url: string) {
    // Manually update FHIR query input with the pagination query
    const queryInput = document.getElementById("fhir-query-input")!;
    const urlParts = new URL(url);

    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )!.set;
    nativeInputValueSetter!.call(queryInput, urlParts.search);

    var inputEvent = new Event("input", { bubbles: true });
    queryInput.dispatchEvent(inputEvent);
  }
  async function handleSubmit(e: any, url: string) {
    e.preventDefault();
    setLoading(true);

    const { fhirResponse, nextUrl, previousUrl } =
      await queryFhirWithPagination(url);
    setNextUrl(nextUrl);
    setPreviousUrl(previousUrl);
    setFhirResponse(fhirResponse);

    updateFhirQueryInput(url);
    setLoading(false);
  }

  return (
    <div className="mt-10 mx-2 flex items center justify-between font-light text-sm text-slate-500">
      <button
        type="button"
        disabled={!previousUrl}
        className={`flex items-center space-x-2 ${btnStyles}`}
        onClick={(e) => handleSubmit(e, previousUrl)}
      >
        <ChevronLeftCircleIcon />
        <p>Previous</p>
      </button>
      <button
        type="button"
        disabled={!nextUrl}
        className={`flex items-center space-x-2 ${btnStyles}`}
        onClick={(e) => handleSubmit(e, nextUrl)}
      >
        <ChevronRightCircleIcon />
        <p>Next</p>
      </button>
    </div>
  );
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
  const [nextUrl, setNextUrl] = useState<string>("");
  const [previousUrl, setPreviousUrl] = useState<string>("");

  async function submitQuery() {
    // Validate query
    if (!query) {
      setError(true);
      return;
    }
    setLoading(true);

    const { fhirResponse, nextUrl, previousUrl } =
      await queryFhirWithPagination(`${fhirServerUrl}${query}`);
    setNextUrl(nextUrl);
    setPreviousUrl(previousUrl);
    setFhirResponse(fhirResponse);

    setLoading(false);
  }

  function handleHttpMethodSelect(value: string) {
    setHttpMethod(value);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    submitQuery();
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center space-x-2">
        <Select
          defaultValue={httpMethod}
          onValueChange={handleHttpMethodSelect}
        >
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
              className="w-24 rounded-full bg-pink-400 transform active:scale-75 transition-transform hover:bg-pink-600 focus:ring-4 focus:ring-pink-200"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
      {(!!nextUrl || !!previousUrl) && (
        <PaginationUI
          setPreviousUrl={setPreviousUrl}
          setNextUrl={setNextUrl}
          setLoading={setLoading}
          setFhirResponse={setFhirResponse}
          nextUrl={nextUrl}
          previousUrl={previousUrl}
        />
      )}
    </div>
  );
}
