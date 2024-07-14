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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function Navbar() {
  const { setTheme } = useTheme();
  const router = useRouter();
  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }
  return (
    <>
      <nav className="top-0 fixed inset-x-0 dark:bg-gray-900 shadow w-full z-50 bg-white dark:text-white">
        <div className="h-16 flex justify-between items-center p-3">
          <Link className="text-2xl font-bold" href="/">
            QWARTYZ
          </Link>
          <div className="flex gap-2 items-center">
            <ToggleTheme setTheme={setTheme} />
            <Options logout={logout} />
          </div>
        </div>
      </nav>
      <div className="pb-20"></div>
    </>
  );
}
function Options({ logout }: { logout: () => void }) {
  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Hacker jangan menyerang</DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem asChild>
              <Link href="/addfriend">Add friend</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/requestfriend">Request Friend</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
          </DialogHeader>
          <h1>Are you sure to logout?</h1>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={logout}>
              Yes
            </Button>
            <DialogClose asChild>
              <Button>No</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Navbar;
