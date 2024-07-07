import { Toast } from "@/components/ui/use-toast";
import { State } from "@/types/main";
import { createClient } from "@supabase/supabase-js";
import { RefObject, FormEvent } from "react";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROJECT!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROJECT!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!)

async function checkLogin() {
    const { data: { user } } = await supabase.auth.getUser();
    if(user) {
        return user;
    }
    return null;
}

const send = async (e: FormEvent<HTMLFormElement>, chatBoxRef: RefObject<HTMLTextAreaElement>, toast: ({ ...props }: Toast) => void, state: State) => {
    e.preventDefault();
    if (!chatBoxRef.current) return;

    const value = chatBoxRef.current.value.replace(/\n/g, "<br/>");
    const validate = value.trim();
    if (!validate) {
      toast({
        title: "Error While Send Message!",
        description: "Message Can't Be Empty!",
        variant: "destructive",
      });
      return;
    }

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

export {
    supabase,
    supabaseAdmin,
    checkLogin,
    send
};