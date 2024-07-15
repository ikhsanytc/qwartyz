"use client";
import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../context-menu";
import { useToast } from "../use-toast";
import {
  convertBrToNewLine,
  convertNewLineToBr,
  decryptMessage,
  encryptMessage,
  supabase,
} from "@/lib/supabase";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Textarea } from "../textarea";
import { Button } from "../button";

interface Props {
  children: ReactNode;
  posisi: "lawan" | "kamu";
  id: number;
  setReplyTo: Dispatch<
    SetStateAction<{ message: string; sender: string } | null>
  >;
  name: string;
}

const Message: FC<Props> = ({ children, posisi, id, setReplyTo, name }) => {
  const [editMsgBox, setEditMsgBox] = useState("");
  const { toast } = useToast();
  async function copy() {
    await navigator.clipboard.writeText(children as string);
    toast({
      title: "Success copy",
    });
  }
  async function edit() {
    const { error } = await supabase
      .from("chat")
      .update({
        message: encryptMessage(convertNewLineToBr(editMsgBox)),
      })
      .eq("id", id)
      .select();
    if (error) {
      toast({
        title: "Error while edit message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setEditMsgBox("");
    toast({
      title: "Success",
    });
  }
  return (
    <>
      <Dialog>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className={`w-1/2 p-2 rounded-lg ${
                posisi === "kamu"
                  ? "bg-slate-600 ml-auto"
                  : "bg-yellow-500 dark:bg-blue-500"
              } break-words cursor-pointer`}
              onDoubleClick={() =>
                setReplyTo({
                  message: decryptMessage(children as string),
                  sender: name,
                })
              }
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: decryptMessage(children as string),
                }}
              ></p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <DialogTrigger asChild>
              {posisi === "kamu" ? (
                <ContextMenuItem>Edit</ContextMenuItem>
              ) : (
                <div className="hidden"></div>
              )}
            </DialogTrigger>
            <ContextMenuItem
              onClick={() =>
                setReplyTo({
                  message: decryptMessage(children as string),
                  sender: name,
                })
              }
            >
              Reply
            </ContextMenuItem>
            <ContextMenuItem onClick={copy}>Copy</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit message</DialogTitle>
          </DialogHeader>
          <div>
            <Textarea
              placeholder="Message..."
              onChange={(e) => setEditMsgBox(e.target.value)}
              defaultValue={convertBrToNewLine(
                decryptMessage(children as string)
              )}
            ></Textarea>
          </div>
          <DialogFooter className="flex flex-col md:flex-row gap-4 md:gap-0">
            <DialogClose asChild>
              <Button onClick={edit}>Submit</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Message;
