"use client";
import Container from "@/components/container";
import { SubmitHandler, useForm } from "react-hook-form";
import { checkLogin, supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { LoginT } from "@/types/main";
import CardLogin from "@/components/Login/Card";
import { useEffect } from "react";

function Page() {
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    checkLogin().then((val) => (val ? router.push("/") : ""));
  }, []);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginT>();
  const login: SubmitHandler<LoginT> = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast({
        title: "Error while login",
        description: error.message,
        variant: "destructive",
      });
      if (error.status === 400) {
        setError("email", {
          type: "manual",
          message: "Email or password is not valid!",
        });
        setError("password", {
          type: "manual",
          message: "Email or password is not valid!",
        });
      }
      return;
    }
    toast({
      title: "Success",
      description: "Welcome to qwartyz",
    });
    router.push("/");
  };

  return (
    <Container center>
      <CardLogin
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        login={login}
      />
    </Container>
  );
}

export default Page;
