"use client";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTheme } from "next-themes";
import ToggleTheme from "./toggleTheme";
import Link from "next/link";

function Navbar() {
  const { setTheme } = useTheme();
  return (
    <>
      <nav className="top-0 fixed inset-x-0 dark:bg-gray-900 shadow w-full z-40 bg-white dark:text-white">
        <div className="h-16 flex justify-between items-center p-3">
          <Link className="text-2xl font-bold" href="/">
            QWARTYZ
          </Link>
          <div className="flex gap-2 items-center">
            <ToggleTheme setTheme={setTheme} />
            <Options />
          </div>
        </div>
      </nav>
      <div className="pb-20"></div>
    </>
  );
}
function Options() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Hacker jangan mneyerang</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Navbar;
