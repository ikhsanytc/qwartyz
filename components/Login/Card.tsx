"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { FC, useState } from "react";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { LoginT } from "@/types/main";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  handleSubmit: UseFormHandleSubmit<LoginT, undefined>;
  login: SubmitHandler<LoginT>;
  errors: FieldErrors<LoginT>;
  register: UseFormRegister<LoginT>;
}

const CardLogin: FC<Props> = (props) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <>
      <Card className="w-full md:w-1/2">
        <form onSubmit={props.handleSubmit(props.login)}>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <Separator className="mb-5" />
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Email..."
                  className={`${props.errors.email && "border-red-600"}`}
                  {...props.register("email", {
                    required: {
                      value: true,
                      message: "Email is required!",
                    },
                  })}
                />
                <p className="text-sm text-red-600">
                  {props.errors.email?.message}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-full">
                  <Input
                    placeholder="Password..."
                    className={`${props.errors.password && "border-red-600"}`}
                    type={showPass ? "text" : "password"}
                    {...props.register("password", {
                      required: {
                        value: true,
                        message: "Password is required!",
                      },
                    })}
                  />
                  <p className="text-sm text-red-600">
                    {props.errors.password?.message}
                  </p>
                </div>
                <Button
                  size="icon"
                  type="button"
                  onClick={() => setShowPass((previous) => !previous)}
                >
                  {showPass ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
          </CardContent>
          <Separator className="mb-5" />
          <CardFooter className="flex justify-between">
            <Button type="submit">Login</Button>
            <Button variant="secondary" type="button" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default CardLogin;
