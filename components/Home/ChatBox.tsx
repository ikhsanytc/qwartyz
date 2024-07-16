"use client";

import { State } from "@/types/main";
import {
  FC,
  FormEvent,
  KeyboardEvent,
  MutableRefObject,
  RefObject,
  useEffect,
  useState,
} from "react";
import Message from "../ui/Message/message";
import { Send } from "lucide-react";
import { Toast } from "../ui/use-toast";
import { socket } from "@/lib/socket";
import { UserModel } from "@/types/model";

interface Props {
  state: State;
  chatContainerRef: RefObject<HTMLDivElement>;
  send: (
    e: FormEvent<HTMLFormElement>,
    chatBoxRef: RefObject<HTMLTextAreaElement>,
    toast: ({ ...props }: Toast) => void,
    state: State
  ) => Promise<void>;
  toast: ({ ...props }: Toast) => void;
  chatBoxRef: RefObject<HTMLTextAreaElement>;
  whoMsgRef: MutableRefObject<string>;
  userRef: MutableRefObject<UserModel | null>;
}

const ChatBox: FC<Props> = ({
  state,
  chatContainerRef,
  send,
  chatBoxRef,
  toast,
  whoMsgRef,
  userRef,
}) => {
  const [replyTo, setReplyTo] = useState<{
    message: string;
    sender: string;
  } | null>(null);
  const [typing, setTyping] = useState(false);
  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    socket.emit("typing", state.user?.username, state.whoMsg);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(
        e as unknown as FormEvent<HTMLFormElement>,
        chatBoxRef,
        toast,
        state
      );
    }
  }
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [replyTo]);
  useEffect(() => {
    socket.on("typingFromServer", (sender, target) => {
      if (sender == whoMsgRef.current && target == userRef.current?.username) {
        setTyping(true);
      }
    });
    socket.on("blurTypeFromServer", (sender, target) => {
      if (sender == whoMsgRef.current && target == userRef.current?.username) {
        setTyping(false);
      }
    });
  }, []);
  return (
    <>
      <div className="dark:bg-slate-400 bg-slate-200 shadow md:flex hidden min-h-screen max-h-screen w-full rounded-lg flex-col">
        {state.whoMsg ? (
          <>
            <div className="dark:bg-gray-800 bg-slate-100 w-full p-2 rounded-t-lg">
              <h1 className="font-semibold text-lg">{state.whoMsg}</h1>
              {typing && <p className="text-sm text-green-500">typing...</p>}
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
                  setReplyTo={setReplyTo}
                  name={chat.sender}
                  posisi={
                    chat.sender === state.user?.username ? "kamu" : "lawan"
                  }
                >
                  {chat.message}
                </Message>
              ))}
            </div>
            <div className="dark:bg-gray-800 bg-slate-100 w-full p-3 rounded-b-lg">
              <form onSubmit={(e) => send(e, chatBoxRef, toast, state)}>
                <div className="flex gap-2 flex-col items-center">
                  <div
                    className={`transition-all duration-300 ${
                      replyTo ? "w-full h-full" : "w-0 opacity-0 h-0"
                    }`}
                  >
                    <div className="bg-gray-300 p-2 rounded-lg mb-2 w-full">
                      <p className="text-sm text-gray-700">Replying to:</p>
                      <p className="font-semibold text-gray-900">
                        {replyTo?.sender} | {replyTo?.message}
                      </p>
                      <button
                        type="button"
                        className="text-xs text-red-500"
                        onClick={() => setReplyTo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <textarea
                      ref={chatBoxRef}
                      onKeyPress={handleKey}
                      onFocus={() => {
                        socket.emit(
                          "typing",
                          state.user?.username,
                          state.whoMsg
                        );
                      }}
                      onBlur={() => {
                        socket.emit(
                          "blurType",
                          state.user?.username,
                          state.whoMsg
                        );
                      }}
                      placeholder="Message"
                      className="rounded-lg w-full bg-transparent outline-none border-2 border-gray-950 dark:border-slate-50 p-2"
                    ></textarea>
                    <button type="submit">
                      <Send />
                    </button>
                  </div>
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
