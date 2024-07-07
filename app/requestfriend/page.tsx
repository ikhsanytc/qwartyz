"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { checkLogin, supabase } from "@/lib/supabase";
import { RequestFriendModel, UserModel } from "@/types/model";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const [account, setAccount] = useState<UserModel>();
  const [requestFriend, setRequestFriend] = useState<RequestFriendModel[]>();
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    checkLogin().then(async (val) => {
      if (!val) {
        router.push("/login");
        return;
      }
      const resAccount = await supabase
        .from("user")
        .select()
        .eq("userId", val.id)
        .single();
      setAccount(resAccount.data);
      const resRequestFriend = await supabase.from("requestFriend").select();
      setRequestFriend(resRequestFriend.data!);
    });
  }, []);
  async function acceptInvite(
    id: number,
    target: string,
    sender: string,
    userId: string,
    img: string,
    status: string
  ) {
    if (status === "Accept") {
      toast({
        title: "Cannot Accept",
        description: "Already accept the invite!",
        variant: "destructive",
      });
      return;
    }
    const updateRequest = await supabase
      .from("requestFriend")
      .update({
        status: "Accept",
      })
      .eq("id", id)
      .select();
    if (updateRequest.error) {
      toast({
        title: "Error while accept the invite!",
        description: updateRequest.error.message,
        variant: "destructive",
      });
      return;
    }
    const description = await supabase
      .from("user")
      .select()
      .eq("username", target)
      .single();
    const insertContact = await supabase
      .from("Contact")
      .insert({
        user: target,
        user2: sender,
        userId: account?.userId,
        userId2: userId,
        description: description.data.description,
        img,
      })
      .select();

    const insertContact2 = await supabase
      .from("Contact")
      .insert({
        user: sender,
        user2: target,
        userId: userId,
        userId2: account?.userId,
        description: account?.description,
        img: account?.img,
      })
      .select();
    if (insertContact.error || insertContact2.error) {
      toast({
        title: "Error while add contact",
        description:
          insertContact.error?.message + " " + insertContact2.error?.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
    });
    router.push("/home");
  }
  return (
    <Container navbar>
      <Card className="w-full md:w-1/2 mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Invite(&apos;s)</CardTitle>
        </CardHeader>
        <Separator className="mb-5" />
        <CardContent>
          <div className="max-h-52 overflow-auto flex flex-col gap-4">
            {requestFriend?.map((request, idx) => {
              if (request.sender === account?.username) {
                return (
                  <div
                    key={idx}
                    className="flex items-center w-full gap-4 dark:bg-gray-800 shadow bg-slate-100 p-2 rounded-lg"
                  >
                    <img
                      src={request.img}
                      className="rounded-full w-16"
                      loading="lazy"
                      alt=""
                    />
                    <div className="flex flex-col gap-1">
                      <h1 className="font-semibold text-xl md:text-2xl dark:text-blue-500 text-yellow-500">
                        {request.target}
                      </h1>
                      <p className="text-sm dark:text-gray-300">
                        {request.status}
                      </p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-1/2 mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-center">
            Incoming invite(&apos;s)
          </CardTitle>
        </CardHeader>
        <Separator className="mb-5" />
        <CardContent>
          <div className="max-h-52 overflow-auto">
            {requestFriend?.map((request, idx) => {
              if (
                request.target == account?.username &&
                request.sender !== account.username
              ) {
                return (
                  <Dialog key={idx}>
                    <DialogTrigger asChild>
                      <div
                        className={`${
                          request.status === "Accept" ? "hidden" : "flex"
                        } items-center cursor-pointer w-full gap-4 dark:bg-gray-800 shadow active:bg-slate-200 dark:active:bg-gray-900 bg-slate-100 p-2 rounded-lg`}
                      >
                        <img
                          src={request.img}
                          className="rounded-full w-16"
                          loading="lazy"
                          alt=""
                        />
                        <div className="flex flex-col gap-1">
                          <h1 className="font-semibold text-xl md:text-2xl dark:text-blue-500 text-yellow-500">
                            {request.sender}
                          </h1>
                          <p className="text-sm dark:text-gray-300">
                            Request you to be friend!
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Accept Invite?</DialogTitle>
                      </DialogHeader>
                      <div>
                        <p>
                          Are you sure to accept invite from {request.sender}?
                        </p>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={() =>
                              acceptInvite(
                                request.id,
                                request.target,
                                request.sender,
                                request.userId,
                                request.img,
                                request.status
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
                );
              }
            })}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Page;
