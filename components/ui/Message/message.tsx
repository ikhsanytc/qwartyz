import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  posisi: "lawan" | "kamu";
}

const Message: FC<Props> = ({ children, posisi }) => {
  if (posisi === "kamu") {
    return (
      <>
        <div className="bg-slate-600 w-1/2 p-2 rounded-lg ml-auto">
          <p>{children}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="dark:bg-blue-600 bg-yellow-500 w-1/2 p-2 rounded-lg">
        <p>{children}</p>
      </div>
    </>
  );
};

export default Message;
