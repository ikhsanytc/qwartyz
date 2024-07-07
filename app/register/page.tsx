"use client";
import Container from "@/components/container";
import CardRegister from "@/components/Register/Card";
import { useToast } from "@/components/ui/use-toast";
import { checkLogin, supabase, supabaseAdmin } from "@/lib/supabase";
import { RegisterT } from "@/types/main";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
  } = useForm<RegisterT>();
  const registerProcess: SubmitHandler<RegisterT> = async (dataForm) => {
    const { error, data } = await supabase.auth.signUp({
      email: dataForm.email,
      password: dataForm.password,
    });
    if (error) {
      toast({
        title: "Error while register!",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    const request = await supabase.from("user").insert({
      username: dataForm.username,
      email: dataForm.email,
      userId: data.user?.id,
      img: "nophoto.png",
      description: "Hey i'm using qwartyz!",
    });
    if (request.error) {
      toast({
        title: "Error while register!",
        description: request.error.message,
        variant: "destructive",
      });
      await supabaseAdmin.auth.admin.deleteUser(data.user?.id!);
      if (request.status === 409) {
        setError("username", {
          type: "manual",
          message: "Username already used",
        });
      }
      return;
    }
    toast({
      title: "Success",
      description: "Check you're email to validation!",
    });
    router.push("/login");
  };
  return (
    <Container center>
      <CardRegister
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        registerProcess={registerProcess}
      />
    </Container>
  );
}

export default Page;
