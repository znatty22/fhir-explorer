export default function Avatar({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col justify-center items-end">
          <h3 className="text-sky-600 text-sm normal-case tracking-wide">
            {name}
          </h3>
          <h3 className="text-xs text-sky-400">{role}</h3>
        </div>
        <div className="avatar">
          <div className="w-10 rounded-full ring-2 ring-sky-400 ring-offset-base-100 ring-offset-2 hover:ring-pink-500">
            <img src="./avatar.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}
