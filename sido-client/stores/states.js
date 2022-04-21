import { atom, selector } from "recoil";

const userState = atom({
  key: "userState",
  default: {
    user: null,
    accessToken: null,
  },
});

const loadingState = atom({
  key: "loadingState",
  default: false,
});

const authState = selector({
  key: "authState",
  get: ({ get }) => {
    if (get(userState).user) {
      return true;
    } else {
      return false;
    }
  },
});

export { userState, authState, loadingState };
