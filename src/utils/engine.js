import { AT_T, NATO } from './alphabet';

export default (type, words) => {
  const inputEngine = type === 'nato' ? NATO : AT_T;
  const result = [];

  words
    .toUpperCase()
    .split('')
    .map((char) => {
      // If character is not a space
      if (char !== ' ') {
        // Convert the character to nato and push to nato array
        const val = inputEngine[char];
        // If val is not undefined, push val to nato array else use original character
        result.push(val !== undefined ? val : char);
      } else {
        result.push(' ');
      }
      return null;
    });

  return result;
};
