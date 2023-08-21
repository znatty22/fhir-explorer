import Logo from "@/components/Logo";

export default function PageLoader() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen font-extralight">
        <div className="flex flex-col justify-center items-center space-y-4">
          <h1 className="text-xl text-pink-400">Loading ...</h1>
          <div className="rounded-full ring-pink-400 ring-2 p-2  animate-bounce">
            <Logo className="fill-pink-400 w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
export function LoginLoader() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen font-extralight">
        <div className="flex flex-col justify-center items-center space-y-8">
          <h1 className="text-2xl text-pink-400">
            Redirecting you to login ...
          </h1>
          <div className="rounded-full ring-pink-400 ring-2 p-2  animate-bounce">
            <Logo className="fill-pink-400 w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
export function Loader() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center font-extralight h-96">
        <div className="flex flex-col justify-center items-center space-y-4">
          <h1 className="text-xl text-pink-400">Loading ...</h1>
          <div className="rounded-full ring-pink-400 ring-2 p-2  animate-bounce">
            <Logo className="fill-pink-400 w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
