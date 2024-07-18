import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeStamp(timestampz: string) {
  const date = new Date(timestampz);
  const formattedDate = date.toLocaleTimeString("en-us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  return formattedDate
}