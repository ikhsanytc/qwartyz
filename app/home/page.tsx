"use client";

import { useEffect, useRef, useReducer, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import Container from "@/components/container";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { decryptMessage, encryptMessage, send, supabase } from "@/lib/supabase";
import ListContact from "@/components/Home/ListContact";
import ChatBox from "@/components/Home/ChatBox";
import { Separator } from "@/components/ui/separator";
import { State, Action } from "@/types/main";
import { ChatModel, UserModel } from "@/types/model";

const initialState: State = {
  whoMsg: "",
  msg: [],
  contact: null,
  user: null,
  login: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_WHO_MSG":
      return { ...state, whoMsg: action.payload };
    case "SET_MSG":
      return { ...state, msg: action.payload };
    case "ADD_MSG":
      return { ...state, msg: [...state.msg, action.payload] };
    case "SET_CONTACT":
      return { ...state, contact: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LOGIN":
      return { ...state, login: action.payload };
    default:
      return state;
  }
};

function Page() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast } = useToast();
  const whoMsgRef = useRef(state.whoMsg);
  const msgRef = useRef(state.msg);
  const userRef = useRef<UserModel | null>(state.user);
  const chatBoxRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      dispatch({ type: "SET_LOGIN", payload: true });

      const { data: userData } = await supabase
        .from("user")
        .select()
        .eq("email", user.email)
        .single();
      dispatch({ type: "SET_USER", payload: userData });

      const { data: contactData } = await supabase
        .from("Contact")
        .select()
        .eq("userId", user.id);
      dispatch({ type: "SET_CONTACT", payload: contactData });
    };

    initializeUser();
  }, [router]);

  useEffect(() => {
    whoMsgRef.current = state.whoMsg;
  }, [state.whoMsg]);

  useEffect(() => {
    userRef.current = state.user;
  }, [state.user]);

  useEffect(() => {
    msgRef.current = state.msg;
  }, [state.msg]);

  useEffect(() => {
    const subscribe = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat" },
        onChangeRealtime
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscribe);
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      dispatch({ type: "SET_MSG", payload: [] });

      const { data: chats } = await supabase
        .from("chat")
        .select()
        .order("created_at", { ascending: true });
      chats?.forEach((chat) => {
        if (
          (chat.target === whoMsgRef.current &&
            chat.sender === userRef.current?.username) ||
          (chat.sender === whoMsgRef.current &&
            chat.target === userRef.current?.username)
        ) {
          dispatch({ type: "ADD_MSG", payload: chat });
        }
      });
    };

    fetchMessages();
  }, [state.whoMsg]);

  const onChangeRealtime = (
    payload: RealtimePostgresChangesPayload<ChatModel>
  ) => {
    if (payload.eventType === "INSERT") {
      const newMsg = payload.new;
      const isChatMessage =
        (newMsg.sender === whoMsgRef.current &&
          newMsg.target === userRef.current?.username) ||
        (newMsg.target === whoMsgRef.current &&
          newMsg.sender === userRef.current?.username);

      if (isChatMessage) dispatch({ type: "ADD_MSG", payload: newMsg });

      if (
        newMsg.target === userRef.current?.username &&
        whoMsgRef.current !== newMsg.sender
      ) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(
              `New Message From ${newMsg.sender}!`,
              {
                body: decryptMessage(newMsg.message),
              }
            );
            notification.onclick = function () {
              window.focus();
              if (isMobile) {
                router.push(`/chat/${newMsg.sender}`);
              } else {
                dispatch({ type: "SET_WHO_MSG", payload: newMsg.sender });
              }
              notification.close();
            };
          } else if (permission === "denied") {
            toast({
              title: newMsg.sender,
              description: decryptMessage(newMsg.message),
              action: (
                <ToastAction
                  altText="Open chat"
                  onClick={() =>
                    isMobile
                      ? router.push(`/chat/${newMsg.sender}`)
                      : dispatch({
                          type: "SET_WHO_MSG",
                          payload: newMsg.sender,
                        })
                  }
                >
                  Open chat
                </ToastAction>
              ),
            });
          }
        });
      }
    }
    if (payload.eventType === "UPDATE") {
      const updateMsg = payload.new;
      const isChatMessage =
        (updateMsg.sender === whoMsgRef.current &&
          updateMsg.target === userRef.current?.username) ||
        (updateMsg.target === whoMsgRef.current &&
          updateMsg.sender === userRef.current?.username);
      if (isChatMessage) {
        const idMsg = msgRef.current.findIndex((msg) => msg.id == updateMsg.id);
        if (idMsg === -1) return;
        const msg = msgRef.current;
        msg[idMsg].message = updateMsg.message;
        dispatch({ type: "SET_MSG", payload: msg });
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [state.msg]);

  return (
    <Container navbar>
      {state.login && (
        <div className="md:flex md:justify-between">
          <ListContact dispatch={dispatch} state={state} />
          <Separator orientation="vertical" />
          <ChatBox
            chatBoxRef={chatBoxRef}
            chatContainerRef={chatContainerRef}
            send={send}
            toast={toast}
            state={state}
          />
        </div>
      )}
      <div className="p-3"></div>
    </Container>
  );
}

export default Page;
