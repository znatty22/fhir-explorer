import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function invariant<T>(
  condition: T,
  message = "Invariant failed."
): asserts condition {
  if (condition) {
    return;
  }
  throw new Error(message);
}

export function invariantEnv<T>(condition: T, env: string): asserts condition {
  return invariant(
    condition,
    `Environment variable "${env}" is missing or empty.`
  );
}


