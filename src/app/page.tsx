import Navbar from "./components/Navbar";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <header>
          <div className="container mx-auto my-10">
            <div>
              <div className="flex items-center space-x-4">
                <p className="text-lg text-blue-400">Kids First QA FHIR API</p>
                <ChevronDownIcon className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>
        </header>
        <section id="workspace" className="">
          <div className="container mx-auto my-10"></div>
        </section>
      </main>
    </div>
  );
}
