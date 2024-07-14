"use client";

import { State } from "@/types/main";
import { FC, FormEvent, KeyboardEvent, RefObject } from "react";
import Message from "../ui/Message/message";
import { Send } from "lucide-react";

interface Props {
  state: State;
  chatContainerRef: RefObject<HTMLDivElement>;
  send: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  chatBoxRef: RefObject<HTMLTextAreaElement>;
}

const ChatBox: FC<Props> = ({ state, chatContainerRef, send, chatBoxRef }) => {
  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(e as unknown as FormEvent<HTMLFormElement>);
    }
  }
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
              <div className="w-1/2 md:text-sm p-2 mb-5 mx-auto text-center text-yellow-500 dark:text-blue-500 rounded-lg bg-slate-600 break-words">
                <p>
                  Your messages are end-to-end encrypted. no one can see the
                  contents of your chat, not even qwartyz can read or understand
                  the contents of your chat.
                </p>
              </div>
              {state.msg?.map((chat, idx) => (
                <Message
                  key={idx}
                  id={chat.id}
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
                    onKeyPress={handleKey}
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
