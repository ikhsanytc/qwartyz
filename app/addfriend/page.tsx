"use client";

import SearchAddFriend from "@/components/AddFriend/Search";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { checkLogin, supabase } from "@/lib/supabase";
import { UserModel } from "@/types/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Page() {
  const [users, setUsers] = useState<UserModel[] | null>();
  const [account, setAccount] = useState<UserModel>();
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    checkLogin().then(async (val) => {
      if (!val) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("user")
        .select()
        .eq("userId", val.id)
        .single();
      setAccount(data);
    });
  }, []);
  async function onSearchChange(keyword: string) {
    if (keyword !== "") {
      const { data } = await supabase
        .from("user")
        .select("*")
        .ilike("username", `%${keyword}%`);
      setUsers(data);
    } else {
      const { data } = await supabase.from("user").select("*");
      setUsers(data);
    }
  }
  async function requestFriend(target: string, userId: string, img: string) {
    const sureRequest = await supabase
      .from("requestFriend")
      .select()
      .eq("userId", account?.userId)
      .eq("userId2", userId)
      .single();
    if (sureRequest.data) {
      toast({
        title: `Already request friend to ${target}`,
        variant: "destructive",
      });
      return;
    }
    const sureRequest2 = await supabase
      .from("requestFriend")
      .select()
      .eq("userId2", account?.userId)
      .eq("userId", userId)
      .single();
    if (sureRequest2.data) {
      toast({
        title: `Already invited by ${target}`,
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.from("requestFriend").insert({
      sender: account?.username,
      target: target,
      userId: account?.userId,
      userId2: userId,
      status: "Pending",
      img,
    });
    if (error) {
      toast({
        title: "Error while add friend!",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
    });
  }
  return (
    <Container navbar>
      <Suspense>
        <SearchAddFriend onChangeSearch={onSearchChange} />
      </Suspense>
      <Card className="mt-20 w-full md:w-1/2 mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Search Friend</CardTitle>
        </CardHeader>
        <Separator className="mb-5" />
        <CardContent>
          <div className="flex flex-col gap-4 max-h-[550px] overflow-auto">
            {account &&
              users &&
              users.map((user, idx) => {
                if (user.userId !== account.userId) {
                  return (
                    <div key={idx}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex items-center cursor-pointer w-full gap-4 dark:bg-gray-800 shadow active:bg-slate-100 dark:active:bg-gray-900 p-2 rounded-lg">
                            <img
                              src={user.img}
                              loading="lazy"
                              className="rounded-full w-16"
                              alt=""
                            />
                            <div className="flex flex-col gap-1">
                              <h1 className="font-semibold text-xl md:text-2xl dark:text-blue-500 text-yellow-500">
                                {user.username}
                              </h1>
                              <p className="text-sm dark:text-gray-300">
                                {user.description}
                              </p>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Friend</DialogTitle>
                          </DialogHeader>
                          <div>
                            <h1>Request friend to {user.username}?</h1>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() =>
                                  requestFriend(
                                    user.username,
                                    user.userId,
                                    user.img
                                  )
                                }
                              >
                                Yes
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button variant="secondary">No</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                }
              })}
            {users?.length == 0 && <h1 className="text-center">Not found!</h1>}
          </div>
        </CardContent>
        <Separator className="mb-5" />

        <CardFooter>
          <Button asChild>
            <Link href="/home">Back</Link>
          </Button>
        </CardFooter>
      </Card>
      <div className="p-5"></div>
    </Container>
  );
}

export default Page;
