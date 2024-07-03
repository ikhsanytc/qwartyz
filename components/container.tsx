import { FC, ReactNode } from "react";
import Navbar from "./ui/navbar";

interface Props {
  navbar?: boolean;
  center?: boolean;
  children: ReactNode;
}

const Container: FC<Props> = ({ navbar, children, center }) => {
  return (
    <main
      className={`${
        center && "justify-center flex flex-col items-center min-h-screen"
      } px-4`}
    >
      {navbar && <Navbar />}
      {children}
    </main>
  );
};

export default Container;
