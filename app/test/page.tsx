"use client";

import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import { useEffect } from "react";

function Page() {
  useEffect(() => {
    if (socket.connected) {
      console.log("yes");
      socket.on("message", (msg) => console.log(msg));
    }
  }, []);
  function sendMsgToServer() {
    if (socket.connected) {
      socket.emit("typing", "ikhsan", "aldi");
    }
    alert("sucs");
  }
  return (
    <>
      <h1>Test</h1>
      <Button onClick={sendMsgToServer}>Click</Button>
    </>
  );
}

export default Page;
