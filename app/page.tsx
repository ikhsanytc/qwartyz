"use client";
import Container from "@/components/container";
import BlockMessage from "@/components/ui/Message/blockMessage";
import Message from "@/components/ui/Message/message";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isMobile } from "react-device-detect";

function Page() {
  const router = useRouter();
  const [whoMsg, setWhoMsg] = useState<string>();
  return (
    <Container navbar>
      <div className="md:flex md:justify-between">
        <div className="flex flex-col p-2 gap-3 md:w-1/2 md:overflow-auto md:max-h-screen">
          {Array.from({ length: 26 }).map((_, idx) => (
            <div
              key={idx}
              onClick={() =>
                isMobile ? router.push("/chat/ikhsan/1") : setWhoMsg("ikhsan")
              }
              className="flex items-center cursor-pointer w-full gap-4 dark:bg-gray-800 shadow active:bg-slate-100 dark:active:bg-gray-900 p-2 rounded-lg"
            >
              <img src="/nophoto.png" className="rounded-full w-16" alt="" />
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-xl md:text-2xl dark:text-blue-500 text-yellow-500">
                  Ikhsan
                </h1>
                <p className="text-sm dark:text-gray-300">
                  Hacker jangan menyerang :)
                </p>
              </div>
            </div>
          ))}
        </div>
        <Separator orientation="vertical" />
        <div className="dark:bg-slate-400 bg-slate-200 shadow md:flex hidden max-h-screen w-full rounded-lg flex-col">
          {whoMsg ? (
            <>
              <div className="dark:bg-gray-800 bg-slate-100 w-full p-2 rounded-t-lg">
                <h1 className="font-semibold text-lg">Ikhsan</h1>
              </div>
              <div className="p-2 flex gap-2 flex-col overflow-auto text-white flex-grow">
                <Message posisi="lawan">Apa kabs</Message>
                <Message posisi="kamu">Baik kabs</Message>
                <Message posisi="lawan">p minjem 100.</Message>
                <Message posisi="lawan">p minjem 100.</Message>
                <Message posisi="lawan">p minjem 100.</Message>
                <Message posisi="lawan">p minjem 100.</Message>
                <Message posisi="lawan">p minjem 100.</Message>
                <Message posisi="lawan">p minjem 100.</Message>
                <BlockMessage />
              </div>
              <div className="dark:bg-gray-800 bg-slate-100 w-full p-3 rounded-b-lg">
                <div className="flex gap-2 items-center">
                  <textarea
                    disabled
                    placeholder="Buka blok untuk mulai berbicara"
                    className="rounded-lg w-full bg-transparent outline-none border-2 border-gray-950 dark:border-slate-50 p-2"
                  ></textarea>
                  <button>
                    <Send />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <h1 className="text-black font-bold text-3xl">
                Just click on the person you want to chat with
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="p-3"></div>
    </Container>
  );
}

export default Page;
