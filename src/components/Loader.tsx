import Logo from "./Logo";

export default function LoginLoader() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen font-extralight">
        <div className="flex flex-col justify-center items-center space-y-8">
          <div className="flex items-center space-x-4">
            <div className="rounded-full ring-pink-400 ring-2 p-2  animate-bounce">
              <Logo className="fill-pink-400 w-6 h-6" />
            </div>
            <h1 className="text-2xl text-pink-400">
              Redirecting to FHIR Explorer login ...
            </h1>
          </div>
          <img
            className="h-1/2 w-auto"
            src="./undraw-personal-info.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
