"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { FC, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  onChangeSearch: (keyword: string) => void;
}

const SearchAddFriend: FC<Props> = ({ onChangeSearch }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("s");
  useEffect(() => {
    onChangeSearch(search ? search : "");
  }, [search]);
  return (
    <>
      <Input
        className="w-full md:w-1/2 mx-auto"
        placeholder="Search..."
        defaultValue={search ? search : ""}
        onChange={(e) => router.push(`/addfriend/?s=${e.target.value}`)}
      />
    </>
  );
};

export default SearchAddFriend;
