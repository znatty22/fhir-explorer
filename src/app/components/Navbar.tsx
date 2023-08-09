import Logo from "./Logo";
import MainMenu from "./MainMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 py-6 bg-white drop-shadow-md">
      <div className="container mx-auto flex flex-row items-center justify-between">
        {/* Left side - title */}
        <div className="flex flex-row items-center space-x-5">
          <div className="rounded-full p-2 ring-2 ring-blue-500 flex justify-center items-center">
            {/* Logo */}
            <div className="h-6 w-6">
              <Logo className="fill-blue-500" />
            </div>
          </div>
          <h1 className="text-xl text-blue-500 font-semibold tracking-wide">
            D3b FHIR Explorer
          </h1>
        </div>
        {/* Right side - avatar menu */}
        <MainMenu name="Natasha Singh" role="admin" src="./avatar.jpg" />
      </div>
    </header>
  );
}
