import Avatar from "./Avatar";

export default function Header() {
  return (
    <header className="sticky top-0 py-8 bg-white drop-shadow-md">
      <div className="container mx-auto flex flex-row items-center justify-between">
        {/* Left side - title */}
        <div className="flex flex-row items-center space-x-5">
          <div className="rounded-full p-2 ring-2 ring-sky-400 flex justify-center items-center">
            {/* Logo */}
            <img className="h-6 w-6" src="./dragon-solid.svg" alt="Logo" />
          </div>
          <h1 className="text-2xl text-sky-400 font-semibold tracking-wide">
            D3b FHIR Explorer
          </h1>
        </div>
        {/* Right side - avatar menu */}
        <div className="flex items-center space-x-10">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost hover:bg-white">
              <Avatar name="Natasha Singh" role="admin" />
            </div>
            <ul
              tabIndex={0}
              className="text-slate-600 dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Setting</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
          {/* Menu  */}
        </div>
      </div>
    </header>
  );
}
