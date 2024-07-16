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
import { useRouter } from "next/navigation";
import { State } from "@/types/main";
import { socket } from "@/lib/socket";
import { UserModel } from "@/types/model";
import { Toast } from "../ui/use-toast";

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
      <div className="dark:bg-slate-400 bg-slate-200 w-full rounded-lg flex flex-col">
        <div className="dark:bg-gray-800 bg-slate-100 w-full rounded-t-lg p-2 flex gap-2 items-center">
          <ArrowLeft onClick={() => router.push("/home")} />
          <div>
            <h1 className="font-bold text-lg">{name}</h1>
            {typing && <p className="text-sm text-green-500">typing...</p>}
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="p-2 flex gap-2 flex-col text-white min-h-[500px] overflow-auto max-h-[500px] scroll-smooth"
        >
          <div className="w-ful p-2 text-sm mb-5 mx-auto text-center text-yellow-500 dark:text-blue-500 rounded-lg bg-slate-600 break-words">
            <p>
              Your messages are end-to-end encrypted. no one can see the
              contents of your chat, not even qwartyz can read or understand the
              contents of your chat.
            </p>
          </div>
          {state.msg.map((message, idx) => (
            <Message
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
          <div className="p-3"></div>
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
                placeholder="Message"
                onFocus={() => {
                  socket.emit("typing", state.user?.username, state.whoMsg);
                }}
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
      <div className="p-10"></div>
    </>
  );
};

export default ChatBoxPhone;
