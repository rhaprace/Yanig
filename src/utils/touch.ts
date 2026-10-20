/** True on phones and tablets: the main pointer is a finger. */
export const isTouchFirst = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
