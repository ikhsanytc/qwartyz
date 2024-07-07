"use client";
import { ArrowLeft, Send } from "lucide-react";
import Message from "../ui/Message/message";
import { FC, FormEvent, RefObject } from "react";
import { useRouter } from "next/navigation";
import { State } from "@/types/main";

interface Props {
  name: string;
  chatContainerRef: RefObject<HTMLDivElement>;
  state: State;
  send: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  chatBoxRef: RefObject<HTMLTextAreaElement>;
}

const ChatBoxPhone: FC<Props> = ({
  name,
  chatContainerRef,
  state,
  send,
  chatBoxRef,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="dark:bg-slate-400 bg-slate-200 w-full max-h-screen rounded-lg flex  flex-col">
        <div className="dark:bg-gray-800 bg-slate-100 w-full rounded-t-lg p-2 flex gap-2">
          <ArrowLeft onClick={() => router.push("/home")} />
          <h1 className="font-bold text-lg">{name}</h1>
        </div>

        <div
          ref={chatContainerRef}
          className="p-2 flex gap-2 flex-col text-white min-h-32 overflow-auto max-h-full scroll-smooth"
        >
          {state.msg.map((message, idx) => (
            <Message
              key={idx}
              posisi={
                message.sender === state.user?.username ? "kamu" : "lawan"
              }
            >
              {message.message}
            </Message>
          ))}
        </div>
      </div>
      <div className="dark:bg-gray-800 bg-slate-100 w-full p-3 fixed bottom-0 inset-x-0">
        <form onSubmit={send}>
          <div className="flex gap-2 items-center">
            <textarea
              ref={chatBoxRef}
              placeholder="Message..."
              className="rounded-lg w-full bg-transparent outline-none border-2 dark:border-slate-50 border-gray-950 p-2"
            ></textarea>
            <button type="submit">
              <Send className="cursor-pointer" />
            </button>
          </div>
        </form>
      </div>
      <div className="p-10"></div>
    </>
  );
};

export default ChatBoxPhone;
