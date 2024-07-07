"use client";

import { State } from "@/types/main";
import { FC, FormEvent, RefObject } from "react";
import Message from "../ui/Message/message";
import { Send } from "lucide-react";

interface Props {
  state: State;
  chatContainerRef: RefObject<HTMLDivElement>;
  send: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  chatBoxRef: RefObject<HTMLTextAreaElement>;
}

const ChatBox: FC<Props> = ({ state, chatContainerRef, send, chatBoxRef }) => {
  return (
    <>
      <div className="dark:bg-slate-400 bg-slate-200 shadow md:flex hidden min-h-screen max-h-screen overflow-auto w-full rounded-lg flex-col">
        {state.whoMsg ? (
          <>
            <div className="dark:bg-gray-800 bg-slate-100 w-full p-2 rounded-t-lg">
              <h1 className="font-semibold text-lg">{state.whoMsg}</h1>
            </div>
            <div
              className="p-2 flex gap-2 flex-col overflow-auto text-white flex-grow scroll-smooth"
              ref={chatContainerRef}
            >
              {state.msg?.map((chat, idx) => (
                <Message
                  key={idx}
                  posisi={
                    chat.sender === state.user?.username ? "kamu" : "lawan"
                  }
                >
                  {chat.message}
                </Message>
              ))}
            </div>
            <div className="dark:bg-gray-800 bg-slate-100 w-full p-3 rounded-b-lg">
              <form onSubmit={send}>
                <div className="flex gap-2 items-center">
                  <textarea
                    ref={chatBoxRef}
                    placeholder="Message"
                    className="rounded-lg w-full bg-transparent outline-none border-2 border-gray-950 dark:border-slate-50 p-2"
                  ></textarea>
                  <button type="submit">
                    <Send />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex text-black justify-center items-center min-h-screen flex-col">
            <h1 className="font-bold text-3xl">QWARTYZ</h1>
            <p className="text-lg font-semibold">
              Free web application chatting!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBox;
