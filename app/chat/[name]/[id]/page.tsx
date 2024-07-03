"use client";
import Container from "@/components/container";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isDesktop } from "react-device-detect";
import { Send } from "lucide-react";
import Message from "@/components/ui/Message/message";
function Page({
  params: { name, id },
}: {
  params: { name: string; id: number };
}) {
  const router = useRouter();
  useEffect(() => {
    if (isDesktop) {
      router.push("/");
    }
  }, []);
  return (
    <Container navbar>
      <div className="dark:bg-slate-400 bg-slate-200 w-full max-h-screen rounded-lg flex flex-col">
        <div className="dark:bg-gray-800 bg-slate-100 w-full rounded-t-lg p-2">
          <h1 className="font-bold text-lg">Ikhsan</h1>
        </div>

        <div className="p-2 flex gap-2 flex-col text-white min-h-32 overflow-auto max-h-full">
          <Message posisi="lawan">Apa kabs</Message>
          <Message posisi="lawan">Apa kabs</Message>
          <Message posisi="lawan">Apa kabs</Message>
          <Message posisi="lawan">Apa kabs</Message>
          <Message posisi="lawan">Apa kabs</Message>
          <Message posisi="lawan">Apa kabs</Message>
          <Message posisi="lawan">Apa kabs</Message>
          <Message posisi="kamu">Bacot</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="lawan">Santai</Message>
          <Message posisi="kamu">Stfu nigga</Message>
        </div>
        <div className="dark:bg-gray-800 bg-slate-100 w-full p-3 rounded-b-lg">
          <div className="flex gap-2 items-center">
            <textarea
              placeholder="Message..."
              className="rounded-lg w-full bg-transparent outline-none border-2 dark:border-slate-50 border-gray-950 p-2"
            ></textarea>
            <Send className="cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="p-3"></div>
    </Container>
  );
}

export default Page;
