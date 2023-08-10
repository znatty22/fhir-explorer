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

export default function FhirQueryForm({
  fhirServerUrl,
}: {
  fhirServerUrl: string;
}) {
  const [httpMethod, setHttpMethod] = useState<string>(HTTP_METHODS[0]);

  function handleHttpMethodSelect(value: string) {
    setHttpMethod(value);
  }
  return (
    <div className="flex justify-between items-center space-x-5">
      <Select onValueChange={handleHttpMethodSelect}>
        <SelectTrigger className="bg-transparent border-0 w-40 rounded-xl text-pink-500 font-semibold text-lg focus:ring-pink-400">
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
      <Input
        className="w-3/4 h-14 rounded-xl text-md text-slate-500 placeholder:text-slate-300 focus-visible:ring-pink-400"
        type="email"
        placeholder="type your query here (e.g. /Patient?gender=female)"
      />
      <Button className="w-24 rounded-full bg-pink-400 hover:bg-pink-600">
        Send
      </Button>
    </div>
  );
}
