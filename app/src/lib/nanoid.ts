import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 12);

export function generatePollId(): string {
  return nanoid();
}

export function generateOptionId(): string {
  return customAlphabet(alphabet, 8)();
}
