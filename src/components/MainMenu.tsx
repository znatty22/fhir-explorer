import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MainMenu({
  name,
  role,
  src,
}: {
  name: string;
  role: string;
  src: string;
}) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col justify-center items-end">
        <h3 className="text-blue-500 text-sm normal-case tracking-wide">
          {name}
        </h3>
        <h3 className="text-xs text-slate-400 uppercase">{role}</h3>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="invisible">
            <Avatar className="ring-2 ring-blue-500 ring-offset-base-100 ring-offset-2 hover:ring-pink-600">
              <AvatarImage src={src} />
              <AvatarFallback className="text-lg text-blue-400 font-light bg-blue-100">
                ?
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="px-4">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
