import { Toast } from "@/components/ui/use-toast";
import { State } from "@/types/main";
import { createClient } from "@supabase/supabase-js";
import { RefObject, FormEvent } from "react";
import CryptoJs from "crypto-js"

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROJECT!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROJECT!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!)

export async function checkLogin() {
    const { data: { user } } = await supabase.auth.getUser();
    if(user) {
        return user;
    }
    return null;
}
export const generateSecretKey = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return key;
};

export function encryptMessage(message: string) {
  return CryptoJs.AES.encrypt(message, process.env.NEXT_PUBLIC_SECRET_KEY!).toString();
}

export function decryptMessage(ciphertext: string) {
  const bytes = CryptoJs.AES.decrypt(ciphertext, process.env.NEXT_PUBLIC_SECRET_KEY!);
  return bytes.toString(CryptoJs.enc.Utf8);
}

export function convertBrToNewLine(text: string) {
  return text.replace(/<br\s*\/?>/gi, "\n");
}

export function convertNewLineToBr(text: string) {
  return text.replace(/\n/g, "<br/>")
}

export const send = async (e: FormEvent<HTMLFormElement>, chatBoxRef: RefObject<HTMLTextAreaElement>, toast: ({ ...props }: Toast) => void, state: State) => {
    e.preventDefault();
    if (!chatBoxRef.current) return;

    let value = chatBoxRef.current.value.replace(/\n/g, "<br/>");
    const validate = value.trim();
    if (!validate) {
      toast({
        title: "Error While Send Message!",
        description: "Message Can't Be Empty!",
        variant: "destructive",
      });
      return;
    }

    value = encryptMessage(value)

    await supabase.from("chat").insert({
      sender: state.user?.username,
      target: state.whoMsg,
      file: null,
      fileTypes: null,
      message: value,
      reply: null,
    });

    chatBoxRef.current.value = "";
};