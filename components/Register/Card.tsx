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
import { RegisterT } from "@/types/main";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  handleSubmit: UseFormHandleSubmit<RegisterT, undefined>;
  registerProcess: SubmitHandler<RegisterT>;
  errors: FieldErrors<RegisterT>;
  register: UseFormRegister<RegisterT>;
}

const CardRegister: FC<Props> = (props) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <>
      <Card className="w-full md:w-1/2">
        <form onSubmit={props.handleSubmit(props.registerProcess)}>
          <CardHeader>
            <CardTitle className="text-center">Register</CardTitle>
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
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Username..."
                  className={`${props.errors.username && "border-red-600"}`}
                  {...props.register("username", {
                    required: {
                      value: true,
                      message: "Username is required!",
                    },
                  })}
                />
                <p className="text-sm text-red-600">
                  {props.errors.username?.message}
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
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      pattern: {
                        value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                        message:
                          "Password must contain at least one number and one special character",
                      },
                    })}
                  />
                  <p className="text-sm text-red-600">
                    {props.errors.password?.message}
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  onClick={() => setShowPass((previous) => !previous)}
                >
                  {showPass ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
          </CardContent>
          <Separator className="mb-5" />
          <CardFooter className="flex justify-between">
            <Button type="submit">Register</Button>
            <Button variant="secondary" type="button" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default CardRegister;
