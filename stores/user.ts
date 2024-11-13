import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    balance: 100000,
  }),
  actions: {},
});
