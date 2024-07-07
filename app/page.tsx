"use client";
import Container from "@/components/container";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
function Page() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      let delay = 2300;
      if (user) {
        setTimeout(() => router.push("/home"), delay);
      } else {
        setTimeout(() => router.push("/login"), delay);
      }
    });
  }, [router]);
  return (
    <Container center>
      <div className="flex flex-col gap-2 text-center items-center">
        <motion.h1
          initial={{ opacity: 0, y: 440 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold"
        >
          QWARTYZ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="font-medium"
        >
          Free web application chatting!
        </motion.p>
      </div>
    </Container>
  );
}

export default Page;
