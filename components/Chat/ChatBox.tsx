"use client";
import { ArrowLeft, Send } from "lucide-react";
import Message from "../ui/Message/message";
import {
  FC,
  FormEvent,
  RefObject,
  useState,
  useEffect,
  MutableRefObject,
} from "react";
import { SendT, State } from "@/types/main";
import { socket } from "@/lib/socket";
import { UserModel } from "@/types/model";
import { Toast } from "../ui/use-toast";
import styles from "./loader.module.css";
import Link from "next/link";

interface Props {
  name: string;
  state: State;
  send: SendT;
  toast: ({ ...props }: Toast) => void;
  chatBoxRef: RefObject<HTMLTextAreaElement>;
  whoMsg: string;
  userRef: MutableRefObject<UserModel | null>;
  loading: boolean;
}

const ChatBoxPhone: FC<Props> = ({
  name,
  state,
  toast,
  send,
  chatBoxRef,
  whoMsg,
  userRef,
  loading,
}) => {
  const [replyTo, setReplyTo] = useState<{
    message: string;
    sender: string;
  } | null>(null);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    socket.on("typingFromServer", (sender, target) => {
      if (sender == whoMsg && target == userRef.current?.username) {
        setTyping(true);
      }
    });
    socket.on("blurTypeFromServer", (sender, target) => {
      if (sender == whoMsg && target == userRef.current?.username) {
        setTyping(false);
      }
    });
  }, []);

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 dark:bg-gray-900 bg-slate-200 p-3">
        <div className="flex gap-2 items-center">
          <Link href="/home">
            <ArrowLeft />
          </Link>
          <div>
            <h1 className="font-bold text-lg">{name}</h1>
            {typing && <p className="text-sm text-green-500">typing...</p>}
          </div>
        </div>
      </div>
      <div className="p-10"></div>
      <div className="flex flex-col gap-4 px-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className={styles.loader}></div>
          </div>
        ) : (
          <>
            <div className="w-full md:text-sm p-2 mb-5 mx-auto text-center text-yellow-500 dark:text-blue-500 rounded-lg bg-slate-600 break-words">
              <p>
                Your messages are end-to-end encrypted. no one can see the
                contents of your chat, not even qwartyz can read or understand
                the contents of your chat.
              </p>
            </div>
            {state.msg.map((chat, idx) => (
              <Message
                key={idx}
                time={chat.created_at}
                id={chat.id}
                setReplyTo={setReplyTo}
                name={chat.sender}
                posisi={chat.sender === state.user?.username ? "kamu" : "lawan"}
              >
                {chat.message}
              </Message>
            ))}
          </>
        )}
      </div>
      <div className="dark:bg-gray-900 z-40 bg-slate-200 w-full p-3 fixed bottom-0 inset-x-0">
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
                placeholder="Message..."
                onInput={() =>
                  socket.emit("typing", state.user?.username, state.whoMsg)
                }
                onBlur={() => {
                  socket.emit("blurType", state.user?.username, state.whoMsg);
                }}
                className="rounded-lg w-full bg-transparent outline-none border-2 border-gray-950 dark:border-slate-50 p-2"
              ></textarea>
              <button type="submit">
                <Send />
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className={`p-5 ${replyTo ? "block" : "hidden"}`}></div>
    </>
  );
};

export default ChatBoxPhone;
