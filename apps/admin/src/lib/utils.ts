import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return dateString;
  }
}
