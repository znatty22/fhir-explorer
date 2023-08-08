export default function Home() {
  return (
    <main>
      <header className="py-10 bg-white drop-shadow-md">
        <div className="container mx-auto flex flex-row items-center space-x-5">
          <div className="rounded-full p-2 ring-4 ring-sky-400 flex justify-center items-center">
            <img className="h-8 w-8" src="./dragon-solid.svg" alt="Logo" />
          </div>
          <h1 className="text-3xl text-sky-400 font-semibold tracking-wide">
            D3b FHIR Explorer
          </h1>
        </div>
      </header>
    </main>
  );
}
