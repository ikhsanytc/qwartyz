import { FormEvent, RefObject } from "react";
import { ChatModel, ContactModel, UserModel } from "./model";
import { Toast } from "@/components/ui/use-toast";

interface LoginT {
    email: string;
    password: string;
}

interface RegisterT {
    email: string;
    username: string;
    password: string;
}

interface State {
  whoMsg: string;
  msg: ChatModel[];
  contact: ContactModel[] | null;
  user: UserModel | null;
  login: boolean;
}

type Action =
  | { type: "SET_WHO_MSG"; payload: string }
  | { type: "SET_MSG"; payload: ChatModel[] }
  | { type: "ADD_MSG"; payload: ChatModel }
  | { type: "SET_CONTACT"; payload: ContactModel[] | null }
  | { type: "SET_USER"; payload: UserModel }
  | { type: "SET_LOGIN"; payload: boolean };

type SendT = (
    e: FormEvent<HTMLFormElement>,
    chatBoxRef: RefObject<HTMLTextAreaElement>,
    toast: ({ ...props }: Toast) => void,
    state: State
  ) => Promise<void>;

export type {
    LoginT,
    RegisterT,
    State,
    Action,
    SendT
}