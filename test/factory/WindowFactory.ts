import type { Window } from "../../src/model/Window";

export const mockWindow = (attrs: Partial<Window> = {}): Window => {
  return {
    id: 1,
    focused: false,
    state: "normal",
    type: "normal",
    children: [],
    ...attrs,
  };
};
