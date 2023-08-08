import Avatar from "./Avatar";
import Logo from "./Logo";

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
                <a>Settings</a>
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
