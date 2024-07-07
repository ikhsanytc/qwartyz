"use client";
import { Action, State } from "@/types/main";
import { useRouter } from "next/navigation";
import { Dispatch, FC } from "react";
import { isMobile } from "react-device-detect";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
  state: State;
  dispatch: Dispatch<Action>;
}

const ListContact: FC<Props> = ({ state, dispatch }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col p-2 gap-3 md:w-1/2 md:overflow-auto md:max-h-screen">
        {state.contact && state.contact.length > 0 ? (
          state.contact.map((kontak, idx) => (
            <div
              key={idx}
              onClick={() =>
                isMobile
                  ? router.push(`/chat/${kontak.user2}`)
                  : dispatch({ type: "SET_WHO_MSG", payload: kontak.user2 })
              }
              className="flex items-center cursor-pointer w-full gap-4 dark:bg-gray-800 shadow active:bg-slate-100 dark:active:bg-gray-900 p-2 rounded-lg"
            >
              <img
                src={kontak.img}
                loading="lazy"
                className="rounded-full w-16"
                alt=""
              />
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-xl md:text-2xl dark:text-blue-500 text-yellow-500">
                  {kontak.user2}
                </h1>
                <p className="text-sm dark:text-gray-300">
                  {kontak.description}
                </p>
              </div>
              {/* {idx < 3 && <div className="ml-auto text-red-600">!</div>} */}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center min-h-screen flex-col gap-2">
            <h1 className="text-lg font-semibold">Nobody here!</h1>
            <Button asChild>
              <Link href="/addfriend">Add friend!</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ListContact;
