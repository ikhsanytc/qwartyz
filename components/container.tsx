import { FC, ReactNode } from "react";
import Navbar from "./ui/navbar";

interface Props {
  navbar?: boolean;
  center?: boolean;
  children: ReactNode;
  noPadding?: boolean;
  bgGray?: boolean;
}

const Container: FC<Props> = ({
  navbar,
  children,
  center,
  noPadding,
  bgGray,
}) => {
  return (
    <main
      className={`${
        center && "justify-center flex flex-col items-center min-h-screen"
      } ${!noPadding && "px-4"} ${
        bgGray && "dark:bg-gray-800 bg-slate-100 min-h-screen"
      }`}
    >
      {navbar && <Navbar />}
      {children}
    </main>
  );
};

export default Container;
