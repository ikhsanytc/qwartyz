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
  Dispatch,
  SetStateAction,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { State } from "@/types/main";
import { socket } from "@/lib/socket";
import { UserModel } from "@/types/model";
import { Toast } from "../ui/use-toast";
import styles from "./loader.module.css";

interface Props {
  name: string;
  chatContainerRef: RefObject<HTMLDivElement>;
  state: State;
  send: (
    e: FormEvent<HTMLFormElement>,
    chatBoxRef: RefObject<HTMLTextAreaElement>,
    toast: ({ ...props }: Toast) => void,
    state: State
  ) => Promise<void>;
  toast: ({ ...props }: Toast) => void;
  chatBoxRef: RefObject<HTMLTextAreaElement>;
  whoMsg: string;
  userRef: MutableRefObject<UserModel | null>;
  loading: boolean;
}

const ChatBoxPhone: FC<Props> = ({
  name,
  chatContainerRef,
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
  const router = useRouter();
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
      <div className="dark:bg-gray-800 bg-slate-100 w-full fixed top-0 z-50 inset-x-0 p-2 flex gap-2 items-center">
        <ArrowLeft onClick={() => router.push("/home")} />
        <div>
          <h1 className="font-bold text-lg">{name}</h1>
          {typing && <p className="text-sm text-green-500">typing...</p>}
        </div>
      </div>
      <div className="dark:bg-slate-400 bg-slate-200 w-full min-h-screen rounded-lg flex flex-col">
        <div
          ref={chatContainerRef}
          className="p-2 flex gap-2 flex-col text-white overflow-auto max-h-screen scroll-smooth"
        >
          <div className="w-ful p-2 text-sm mb-5 mx-auto text-center text-yellow-500 dark:text-blue-500 rounded-lg bg-slate-600 break-words mt-10">
            <p>
              Your messages are end-to-end encrypted. no one can see the
              contents of your chat, not even qwartyz can read or understand the
              contents of your chat.
            </p>
          </div>
          <div
            className={`flex justify-center items-center transition-all duration-300 ${
              loading ? "opacity-100 w-full h-full" : "opacity-0 h-0 w-0"
            }`}
          >
            <div className={styles.loader}></div>
          </div>
          {state.msg.map((message, idx) => (
            <Message
              time={message.created_at}
              id={message.id}
              key={idx}
              setReplyTo={setReplyTo}
              name={message.sender}
              posisi={
                message.sender === state.user?.username ? "kamu" : "lawan"
              }
            >
              {message.message}
            </Message>
          ))}
          <div className={`p-5 ${replyTo ? "block" : "hidden"}`}></div>
        </div>
      </div>
      <div className="dark:bg-gray-800 z-40 bg-slate-100 w-full p-3 fixed bottom-0 inset-x-0">
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
