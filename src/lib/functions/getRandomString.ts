import { randomInt } from "./randomInt";

const defaultAlphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Gets a random string of the given length
 */
export function getRandomString(
  len: number,
  opts: {
    alphabet?: string;
  } = {}
) {
  const alphabet = opts.alphabet ?? defaultAlphabet;
  let str = "";
  for (let i = 0; i < len; i++) {
    str += alphabet.charAt(randomInt(alphabet.length));
  }
  return str;
}
