"use client";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useRef, Reducer, useState } from "react";
import { isDesktop, isMobile } from "react-device-detect";
import Container from "@/components/container";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { checkLogin, send, supabase } from "@/lib/supabase";
import { ChatModel, ContactModel, UserModel } from "@/types/model";
import { State, Action } from "@/types/main";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import ChatBoxPhone from "@/components/Chat/ChatBox";

const initialState: State = {
  whoMsg: "",
  msg: [],
  contact: null,
  user: null,
  login: false,
};

const reducer: Reducer<State, Action> = (state, action) => {
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

function Page({ params: { name } }: { params: { name: string } }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast } = useToast();
  const userRef = useRef<UserModel | null>(null);
  const msgRef = useRef(state.msg);
  const chatBoxRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const user = await checkLogin();
      if (!user) {
        router.push("/login");
        return;
      }
      if (isDesktop) {
        router.push("/home");
        return;
      }
      dispatch({ type: "SET_LOGIN", payload: true });
      const { data: userData } = await supabase
        .from("user")
        .select()
        .eq("email", user.email)
        .single();
      if (userData.username === name) {
        toast({
          title: "Forbidden 403",
          variant: "destructive",
        });
        router.push("/home");
        // console.log("ya");
        return;
      }
      dispatch({ type: "SET_USER", payload: userData });
      const { data: contactData } = await supabase
        .from("Contact")
        .select()
        .eq("userId", user.id);
      dispatch({ type: "SET_CONTACT", payload: contactData });
      dispatch({ type: "SET_WHO_MSG", payload: name });
      setLoading(false);
    };
    initialize();
  }, [name, router]);

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
    const loadMessages = async () => {
      setLoading(true);
      dispatch({ type: "SET_MSG", payload: [] });
      const { data: chatData } = await supabase
        .from("chat")
        .select()
        .order("created_at", { ascending: true });
      chatData?.forEach((chat) => {
        if (
          (chat.target === name && chat.sender === userRef.current?.username) ||
          (chat.sender === name && chat.target === userRef.current?.username)
        ) {
          dispatch({ type: "ADD_MSG", payload: chat });
        }
      });
      setLoading(false);
    };
    loadMessages();
  }, [state.whoMsg, name]);

  const onChangeRealtime = (
    payload: RealtimePostgresChangesPayload<ChatModel>
  ) => {
    if (payload.eventType === "INSERT") {
      const newMsg = payload.new;
      const isCurrentChat =
        (newMsg.sender === name &&
          newMsg.target === userRef.current?.username) ||
        (newMsg.target === name && newMsg.sender === userRef.current?.username);

      if (isCurrentChat) {
        dispatch({ type: "ADD_MSG", payload: newMsg });
      } else if (newMsg.target === userRef.current?.username) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(
              `New Message From ${newMsg.sender}!`,
              {
                body: newMsg.message,
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
              description: newMsg.message,
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
        (updateMsg.sender === name &&
          updateMsg.target === userRef.current?.username) ||
        (updateMsg.target === name &&
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
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [state.msg]);

  return (
    <Container noPadding bgGray>
      <ChatBoxPhone
        toast={toast}
        chatBoxRef={chatBoxRef}
        loading={loading}
        whoMsg={name}
        userRef={userRef}
        name={name}
        send={send}
        state={state}
      />
      <div className="p-20"></div>
    </Container>
  );
}

export default Page;
